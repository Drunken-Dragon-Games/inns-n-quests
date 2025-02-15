import { LoggingContext } from "../tools-tracing";
import * as models from "./models"
import { IdentityService } from "./service-spec";

export class IdentityServiceLogging implements IdentityService {

    constructor(private base: IdentityService) {}

    private withComponent(logger?: LoggingContext): LoggingContext | undefined {
        return logger?.withComponent("identity-service")
    }

    async loadDatabaseModels(): Promise<void> { 
        await this.base.loadDatabaseModels() 
    }

    async unloadDatabaseModels(): Promise<void> { 
        await this.base.unloadDatabaseModels() 
    }

    async health(logger?: LoggingContext): Promise<models.HealthStatus> {
        const serviceLogger = this.withComponent(logger)
        const status = await this.base.health(serviceLogger)
        if (status.status != "ok") 
            serviceLogger?.warn("unhealthy", { status })
        return status 
    }

    async createSigNonce(address: string, logger?: LoggingContext): Promise<models.CreateNonceResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("creating sig nonce for address", { address })
        const response = await this.base.createSigNonce(address, serviceLogger)
        serviceLogger?.info(`sig nonce status: ${response.status}`)
        return response
    }

    async createAuthTxState(userId: string, stakeAddress: string, txHash: string, logger?: LoggingContext): Promise<models.CreateAuthStateResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info(`creating auth Tx for user ${userId} for stake address ${stakeAddress}`)
        const response = await this.base.createAuthTxState(userId, stakeAddress, txHash, logger)
        if (response.status !== "ok") serviceLogger?.error(`could not create authTx state reason: ${response.reason}`)
        else serviceLogger?.info(`succesfully created Auth tx with id ${response.authStateId}`)
        return response
    }

    async verifyAuthState(authStateId: string, tx: string, userId: string, logger?: LoggingContext | undefined): Promise<models.VerifyAuthStateResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info(`verifying auth attempt ${authStateId} with tx`)
        const response = await this.base.verifyAuthState(authStateId, tx, userId, logger)
        serviceLogger?.info(`verifying authState in db status: ${response.status} for user ${userId}`)
        return response
    }

    async completeAuthState(authStateId: string, status: models.AssosiationOutcome, logger?: LoggingContext | undefined): Promise<models.CompleteAuthStateResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info(`updatting ${authStateId}`)
        const response = await this.base.completeAuthState(authStateId, status, logger)
        serviceLogger?.info(`updating authState in db status: ${response.status}`)
        return response
    }

    async authenticate(credentials: models.Credentials, logger?: LoggingContext): Promise<models.AuthenticationResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("authenticating user", { ctype: credentials.ctype, deviceType: credentials.deviceType })
        const response = await this.base.authenticate(credentials, serviceLogger)
        serviceLogger?.info(`authentication status: ${response.status}`)
        return response
    }

    async register(credentials: models.Credentials, logger?: LoggingContext): Promise<models.RegistrationResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("registering user", { ctype: credentials.ctype, deviceType: credentials.deviceType })
        const response = await this.base.register(credentials, serviceLogger)
        serviceLogger?.info(`registration status: ${response.status}`)
        return response
    }

    async associate(userId: string, credentials: models.Credentials, logger?: LoggingContext): Promise<models.AssociationResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("associating user accounts", { userId, ctype: credentials.ctype, deviceType: credentials.deviceType })
        const response = await this.base.associate(userId, credentials, serviceLogger)
        serviceLogger?.info(`association status: ${response.status}`)
        return response
    }

    async deassociateWallet(userId: string, stakeAddress: string, logger?: LoggingContext | undefined): Promise<models.DeassociationResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info(`Deassosiating stake address ${stakeAddress}`)
        const response = await this.base.deassociateWallet(userId, stakeAddress, serviceLogger)
        if (response.ctype !== "success") logger?.log.error(`error ${response.error}`)
        else logger?.log.info(`succesfully deasociated`)
        return response
    }

    async getTotalUsers(logger?: LoggingContext ): Promise<number> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.getTotalUsers(serviceLogger)
        return response
    }

    async listAllUserIds(logger?: LoggingContext): Promise<string[]> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.listAllUserIds(serviceLogger)
        logger?.log.info(`Listed all users`)
        return response
    }

    async setCollectionLock(userId: string, locked: boolean, logger?: LoggingContext | undefined): Promise<models.SetCollectionLockResult> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.setCollectionLock(userId, locked, serviceLogger)
        if (response.status == "ok") logger?.log.info(`set Collection locked state to ${locked}`)
        else logger?.log.error(`Could not set collection state`)
        return response
    }
    async setCollectionLockAll(state: boolean, logger?: LoggingContext | undefined): Promise<models.SetCollectionLockResult>{
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.setCollectionLockAll(state, serviceLogger)
        if (response.status == "ok") logger?.log.info(`set Collection locked state to ${state}`)
        else logger?.log.error(`Could not set collection state`)
        return response
    }

    async getCollectionLockState(userId: string, logger?: LoggingContext | undefined): Promise<models.GetCollectionLockResult> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.getCollectionLockState(userId, serviceLogger)
        if (response.status == "ok") logger?.log.info(`Retrived colleciton state`)
        else logger?.log.error(`Could not get collection state`)
        return response
    }

    async refresh(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<models.RefreshResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("refreshing user token", { sessionId })
        const response = await this.base.refresh(sessionId, refreshToken, serviceLogger)
        serviceLogger?.info(`token refresh status: ${response.status}`)
        return response
    }

    async listSessions(userId: string, logger?: LoggingContext): Promise<models.ListSessionsResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("listening sessions", { userId })
        const response = await this.base.listSessions(userId, serviceLogger)
        serviceLogger?.info(`sessions list status: ${response.status}`)
        return response
    }

    async signout(sessionId: string, logger?: LoggingContext): Promise<models.SignOutResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("signing out user", { sessionId })
        const response = await this.base.signout(sessionId, logger)
        serviceLogger?.info(`signout status: ${response.status}`)
        return response
    }

    async resolveUser(info: models.UserResolutionType, logger?: LoggingContext): Promise<models.ResolveUserResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("resolving user", { info })
        const response = await this.base.resolveUser(info, serviceLogger)
        serviceLogger?.info(`user resolution status: ${response.status}`)
        return response
    }

    async resolveUsers(userIds: string[], logger?: LoggingContext): Promise<models.UserInfo[]> {
        const serviceLogger = this.withComponent(logger)
        //serviceLogger?.info("resolving users", { userIds })
        const response = await this.base.resolveUsers(userIds, serviceLogger)
        //serviceLogger?.info(`users resolution status: ${response.length} users`)
        return response
    }

    async resolveSession(sessionId: string, logger?: LoggingContext): Promise<models.ResolveSesionResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("resolving session", { sessionId })
        const response = await this.base.resolveSession(sessionId, serviceLogger)
        serviceLogger?.info(`session resolution status: ${response.status}`)
        return response
    }

    async updateUser(userId: string, info: { nickname: string }, logger?: LoggingContext): Promise<models.UpdateUserResult> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("updating user", { userId, info })
        const response = await this.base.updateUser(userId, info, serviceLogger)
        serviceLogger?.info(`user update status: ${response.status}`)
        return response
    }

    async migrationFixDiscordUsernameInDB(logger?: LoggingContext): Promise<void> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.info("fixing discord usernames in db")
        await this.base.migrationFixDiscordUsernameInDB(serviceLogger)
        serviceLogger?.info("finished fixing discord usernames in db")
    }
}