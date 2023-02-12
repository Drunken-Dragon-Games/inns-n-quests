import dotenv from "dotenv"
import { QueryInterface, Sequelize } from "sequelize"
import { validateStakeAddress } from "./cardano/address"
import { generateNonce, verifySig } from "./cardano/signature-verification"
import { verifyDiscordAuthCode, DiscordConfig, validateDiscordSession } from "./discord/code-verification"
import { Users } from "./users/users"
import { Sessions, SessionsConfig } from "./sessions/sessions";
import { IdentityService } from "./service-spec"
import { LoggingContext } from "../tools-tracing"
import { connectToDB, DBConfig, buildMigrator } from "../tools-database"
import { IdentityServiceLogging } from "./logging"
import { config, HealthStatus } from "../tools-utils"

import { 
    CreateNonceResult, Credentials, AuthenticationResult, RegistrationResult, AssociationResult, 
    RefreshResult, ListSessionsResult, SignOutResult, ResolveUserResult, ResolveSesionResult, 
    UpdateUserResult, 
    UserInfo
} from "./models"

import * as cardanoDB from "./cardano/signature-verification-db"
import * as sessionsDB from "./sessions/session-db"
import * as usersDB from "./users/users-db"
import path from "path"
import { Umzug } from "umzug"

export interface IdentityServiceConfig 
    { network: string
    , discord: DiscordConfig
    , sessions: SessionsConfig
    }

export interface IdentityServiceDependencies
    { database: Sequelize
    }

export class IdentityServiceDsl implements IdentityService {

    private readonly migrator: Umzug<QueryInterface>

    constructor(
        private readonly database: Sequelize,
        private readonly network: string,
        private readonly discordConfig: DiscordConfig,
        private readonly sessions: Sessions
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: IdentityServiceDependencies): Promise<IdentityService> {
        dotenv.config()
        return await IdentityServiceDsl.loadFromConfig(
            { network: config.stringOrElse("CARDANO_NETWORK", "testnet")
            , discord:
                { clientId: config.stringOrError("DISCORD_CLIENT_ID")
                , clientSecret: config.stringOrError("DISCORD_CLIENT_SECRET")
                , redirectValidate: config.stringOrError("DISCORD_REDIRECT_URI_VALIDATE")
                , redirectAdd: config.stringOrError("DISCORD_REDIRECT_URI_ADD")
                }
            , sessions:
                { duration: config.intOrElse("IDENTITY_SERVICE_SESSIONS_DURATION", 1000 * 60 * 60 * 24)
                }
            }, dependencies)
    }

    static async loadFromConfig(servConfig: IdentityServiceConfig, dependencies: IdentityServiceDependencies): Promise<IdentityService> {
        const service = new IdentityServiceLogging(new IdentityServiceDsl
            ( dependencies.database
            , servConfig.network
            , servConfig.discord
            , new Sessions(servConfig.sessions)
            ))
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        usersDB.configureSequelizeModel(this.database)
        cardanoDB.configureSequelizeModel(this.database)
        sessionsDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
        await this.database.close()
    }

    async health(logger?: LoggingContext): Promise<HealthStatus> {
        let dbHealth: "ok" | "faulty"
        try { await this.database.authenticate(); dbHealth = "ok" }
        catch (e) { console.error(e); dbHealth = "faulty" }
        const status = dbHealth == "faulty" ?  "faulty" : "ok"
        return {
            status,
            dependencies: [{ name: "database", status: dbHealth }]
        }
    }

    async createSigNonce(address: string, logger?: LoggingContext): Promise<CreateNonceResult> {
        if (!validateStakeAddress(address, this.network)) return { status: "bad-address" }
        else {
            const nonce = await generateNonce(address)
            return { status: "ok", nonce }
        }
    }

    async authenticate(credentials: Credentials, logger?: LoggingContext): Promise<AuthenticationResult> {
        if (credentials.ctype === "sig") {
            const stakeAddress = await verifySig(credentials.signedNonce, credentials.nonce, credentials.publicKey)
            if (stakeAddress.ctype == "failure")
                return { status: "bad-credentials" }
            else {
                const userId = await Users.registerWithStakingAddress(stakeAddress.result)
                const tokens = await this.sessions.create(userId, "Sig", credentials.deviceType)
                return { status: "ok", tokens }
            }
        } else if (credentials.ctype === "discord") {
            const discordTokens = await verifyDiscordAuthCode(credentials.authCode, this.discordConfig, "validate")
            if (discordTokens.ctype == "failure")
                return { status: "bad-credentials" }
            else {
                const userId = await Users.registerWithDiscordTokens(discordTokens.result)
                if (userId.ctype == "failure"){
                    return { status: "bad-credentials" }
                }else{
                    const tokens = await this.sessions.create(userId.result, "Discord", credentials.deviceType)
                    return { status: "ok", tokens }
                }
            }
        } else {
            return <AuthenticationResult>{}
        }
    }

    async register(credentials: Credentials, logger?: LoggingContext): Promise<RegistrationResult> {
        return <RegistrationResult>{}
    }

    async associate(userId: string, credentials: Credentials, logger?: LoggingContext): Promise<AssociationResult> {
        if (credentials.ctype === "sig") {
            const stakeAddress = await verifySig(credentials.signedNonce, credentials.nonce, credentials.publicKey)
            if (stakeAddress.ctype == "failure") return { status: "bad-credentials" }
            else {
                const asosiatedUser = await Users.associateWithStakingAddress(userId, stakeAddress.result)
                if (asosiatedUser.ctype == "failure") return { status: "bad-credentials" }
                else return { status: asosiatedUser.result }
            }
        } else if (credentials.ctype === "discord") {
            const discordTokens = await verifyDiscordAuthCode(credentials.authCode, this.discordConfig, "add")
            if (discordTokens.ctype == "failure") return { status: "bad-credentials" }
            else {
                const asosiatedUser = await Users.associateWithDiscord(userId, discordTokens.result)
                if (asosiatedUser.ctype == "failure") return { status: "bad-credentials" }
                else return { status: asosiatedUser.result }
            }
        } else {
            return <AssociationResult>{}
        }
    }

    async refresh(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<RefreshResult> {
        const newSession = await this.sessions.renew(sessionId, refreshToken)
        if (newSession.ctype == "failure") return { status: "bad-refresh-token" }
        else return { status: "ok", tokens: newSession.result }
    }

    async listSessions(userId: string, logger?: LoggingContext): Promise<ListSessionsResult> {
        const sessions = await this.sessions.list(userId)
        return { status: "ok", sessions }
    }

    async signout(sessionId: string, logger?: LoggingContext): Promise<SignOutResult> {
        const destroyed = await this.sessions.delete(sessionId)
        if (destroyed > 0) return { status: "ok" }
        else return { status: "unknown-session" }
    }

    async resolveUser(info: { ctype: "user-id", userId: string } | { ctype: "nickname", nickname: string }, logger?: LoggingContext): Promise<ResolveUserResult> {
        const user = await Users.resolve(info)
        if (user.ctype == "failure") return { status: "unknown-user-id" }
        else return { status: "ok", info: user.result }
    }

    async resolveUsers(userIds: string[], logger?: LoggingContext): Promise<UserInfo[]> {
        return await Users.resolveUsersNoStakeAddresses(userIds)
    }

    async resolveSession(sessionId: string, logger?: LoggingContext): Promise<ResolveSesionResult> {
        const session = await this.sessions.resolve(sessionId)
        if (session.ctype == "failure") return { status: "unknown-session-id" }
        if (session.result.authType == "Discord"){
            const discordSession = await validateDiscordSession(session.result, this.discordConfig)
            if (discordSession.ctype == "failure") return { status: "invalid-discord-token" }
        }
        const user = await Users.getinfo(session.result.userId)
        if (user.ctype == "failure") return { status: "unknown-user-id" }
            else return { status: "ok", info: user.result }
    }

    async updateUser(userId: string, info: { nickname: string }, logger?: LoggingContext): Promise<UpdateUserResult> { 
        await Users.update(userId, info)
        return { status: "ok" }
    }
}