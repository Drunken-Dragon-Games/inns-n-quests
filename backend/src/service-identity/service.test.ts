import axios from 'axios';
import crypto from "crypto"
import { User } from "./users/users-db"
import { IdentityServiceDsl } from "./service"
import { IdentityService } from "./service-spec";
import { CardanoNetwork, Wallet } from "../tools-cardano";
import { success, failure, unit } from "../tools-utils";
import { AuthenticationTokens, UserInfo, UserFullInfo } from "./models";
import { expectResponse } from "../tools-utils/api-expectations";
import { connectToDB, DBConfig } from "../tools-database";

let network: CardanoNetwork = "testnet"
let service: IdentityService

const databaseConfig: DBConfig = 
    { host: "localhost"
    , port: 5432
    , username: "postgres"
    , password: "admin"
    , database: "service_db" 
    }

beforeEach(async () => {
    service = await IdentityServiceDsl.loadFromConfig(
        { network
        , discord:
            { clientId: "" , clientSecret: "" , redirectValidate: "", redirectAdd: "" }
        , sessions:
            { duration: 1000 }
        }
      , { database: connectToDB(databaseConfig) })
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

const nonceOk = (account: Wallet): Promise<string> => 
    expectResponse(
        service.createSigNonce(account.stakeAddress.to_address().to_bech32()),
        (response) => 
            response.status === "ok" ? 
            success(response.nonce) : 
            failure(`Expected 'ok' from createSigNonce but got ${JSON.stringify(response)}`))

const authenticateSigOk = (account: Wallet, nonce: string): Promise<AuthenticationTokens> => {
    const { signature, key } = account.signData(nonce)
    return expectResponse(
        service.authenticate({ ctype: "sig", signedNonce: signature, nonce, publicKey: key, deviceType: "Browser" }),
        (response) => 
            response.status === "ok" ? 
            success(response.tokens) : 
            failure(`Expected 'ok' from expectTokens ${JSON.stringify(response)}`))
}

const createSigAccount = async (): Promise<{ wallet: Wallet, tokens: AuthenticationTokens }> => {
    const wallet = Wallet.generate(network, "password")
    const nonce = await nonceOk(wallet)
    const tokens = await authenticateSigOk(wallet, nonce) 
    return { wallet, tokens }
}

const createDiscordAccount = async (username: string = ""): Promise<AuthenticationTokens> => {
    const discordAuthCode = "whatever"
    jest.spyOn(axios, 'post').mockImplementation(async (url, params: any, headers) => {
        if (params.includes(`code=${discordAuthCode}`)) {
            return {
                data: {
                    access_token: "validToken",
                    expires_in: 1,
                    refresh_token: "validRefresh",
                    scope: "",
                    token_type: "Bearer"
                }
            }
        }
        else {
            return {
                data: {
                    access_token: "",
                    expires_in: 1,
                    refresh_token: crypto.randomBytes(20).toString('hex'),
                    scope: "",
                    token_type: ""
                }
            }
        }
    });
    jest.spyOn(axios, 'get').mockImplementation(async (url, headers) => {
        return {
            data: {
                username: username == "" ? crypto.randomBytes(20).toString('hex') : username,
                discriminator: "1234",
                email: crypto.randomBytes(20).toString('hex')
            }
        }
    });
    const tokens = await expectResponse(
        service.authenticate({ ctype: "discord", authCode: discordAuthCode, deviceType: "Browser"}),
        (response) => 
            response.status === "ok" ? 
            success(response.tokens) : 
            failure(`Expected 'ok' from expectTokens ${JSON.stringify(response)}`))
    return tokens 
}

test("health endpoint", async () => {
    const response = await service.health()
    expect(response).toStrictEqual({
        status: "ok",
        dependencies: [{ name: "database", status: "ok" }] })
})

test("authenticate sig: ok", async () => {
    await createSigAccount()
})

test("authenticate discord: ok", async () => {
    await createDiscordAccount()
})

test("associate wallet: ok", async () => {
    const tokens = await createDiscordAccount()
    const account = Wallet.generate(network, "password")
    const stakeAddress = account.stakeAddress.to_address().to_bech32()
    const nonce: string = await expectResponse(
        service.createSigNonce(stakeAddress),
        (response) => 
            response.status === "ok" ? 
            success(response.nonce) : 
            failure(`Expected 'ok' from createSigNonce but got ${JSON.stringify(response)}`))
    const { signature, key } = account.signData(nonce)
    await expectResponse(
        service.associate( tokens.session.userId, { ctype: "sig", signedNonce: signature, nonce, publicKey: key, deviceType: "Browser" } ),
        (response) => 
            response.status === "ok" ? 
            success({}) : 
            failure(`Expected 'ok' from expectTokens ${JSON.stringify(response)}`))
})


test("associate wallet: wallet Used", async () => {
    const tokens = await createDiscordAccount()
    const accountObject = await createSigAccount()
    const account = accountObject.wallet
    const stakeAddress = account.stakeAddress.to_address().to_bech32()
    const nonce: string = await expectResponse(
        service.createSigNonce(stakeAddress),
        (response) => 
            response.status === "ok" ? 
            success(response.nonce) : 
            failure(`Expected 'ok' from createSigNonce but got ${JSON.stringify(response)}`))
    const { signature, key } = account.signData(nonce)
    await expectResponse(
        service.associate( tokens.session.userId, { ctype: "sig", signedNonce: signature, nonce, publicKey: key, deviceType: "Browser" } ),
        (response) => 
            response.status === "stake-address-used"? 
            success({}) : 
            failure(`Expected 'stake-address-used' from expectTokens ${JSON.stringify(response)}`))
})

test("associate discord: ok", async () => {
    const discordAuthCode = "whatever"
    jest.spyOn(axios, 'post').mockImplementation(async (url, params: any, headers) => {
        if (params.includes(`code=${discordAuthCode}`)) {
            return {
                data: {
                    access_token: "validToken",
                    expires_in: 1,
                    refresh_token: "validRefresh",
                    scope: "",
                    token_type: "Bearer"
                }
            }
        }
        else {
            return {
                data: {
                    access_token: "",
                    expires_in: 1,
                    refresh_token: "",
                    scope: "",
                    token_type: ""
                }
            }
        }
    });
    jest.spyOn(axios, 'get').mockImplementation(async (url, headers) => {
        return {
            data: {
                username: "santiago",
                discriminator: "1234",
                email: "santiago1234@mail.com"
            }
        }
    });
    const account = await createSigAccount()
    await expectResponse(
        service.associate( account.tokens.session.userId, { ctype: "discord",  authCode: discordAuthCode, deviceType: "Browser" } ),
        (response) => 
            response.status === "ok" ? 
            success({}) : 
            failure(`Expected 'ok' from expectTokens ${JSON.stringify(response)}`))
})

test("associate discord: discord used", async () => {
    const discordAuthCode = "whatever"
    const tokens = await createDiscordAccount("InigoMontoya")
    const account = await createSigAccount()
    await expectResponse(
        service.associate( account.tokens.session.userId, { ctype: "discord",  authCode: discordAuthCode, deviceType: "Browser" } ),
        (response) => 
            response.status === "discord-used" ? 
            success({}) : 
            failure(`Expected 'ok' from expectTokens ${JSON.stringify(response)}`))
})

test("authenticate sig: bad - bad address", async () => {
    await expectResponse(
        service.createSigNonce("whatever"),
        (response) => 
            response.status === "bad-address" ? 
            success(unit) : 
            failure(`Expected 'bad-address' from createSigNonce but got ${JSON.stringify(response)}`))
})

test("authenticate sig: bad - bad nonce or bad signature", async () => {
    const account = Wallet.generate(network, "password")
    const stakeAddress = account.stakeAddress.to_address().to_bech32()
    const nonce: string = await expectResponse(
        service.createSigNonce(stakeAddress),
        (response) => 
            response.status === "ok" ? 
            success(response.nonce) : 
            failure(`Expected 'ok' from createSigNonce but got ${JSON.stringify(response)}`))
    const sig1 = account.signData(nonce)
    await expectResponse(
        service.authenticate({ ctype: "sig", signedNonce: sig1.signature, nonce: "whatever", publicKey: sig1.key, deviceType: "Browser" }),
        (response) => 
            response.status === "bad-credentials" ? 
            success(unit) : 
            failure(`Expected 'bad-credentials' from expectTokens ${JSON.stringify(response)}`))
    const sig2 = account.signData("whatever")
    await expectResponse(
        service.authenticate({ ctype: "sig", signedNonce: sig2.signature, nonce, publicKey: sig2.key, deviceType: "Browser" }),
        (response) => 
            response.status === "bad-credentials" ? 
            success(unit) : 
            failure(`Expected 'bad-credentials' from expectTokens ${JSON.stringify(response)}`))
    const account2 = Wallet.generate(network, "password")
    const sig3 = account2.signData(nonce)
    await expectResponse(
        service.authenticate({ ctype: "sig", signedNonce: sig3.signature, nonce, publicKey: sig3.key, deviceType: "Browser" }),
        (response) => 
            response.status === "bad-credentials" ? 
            success(unit) : 
            failure(`Expected 'bad-credentials' from expectTokens ${JSON.stringify(response)}`))
})

test("sessions: ok", async () => {
    const account = await createSigAccount()
    const sessionsInfo = await service.listSessions(account.tokens.session.userId)
    expect(account.tokens.session.sessionId).toEqual(sessionsInfo.sessions[0].sessionId)
    expect(account.tokens.session.authType).toEqual(sessionsInfo.sessions[0].authType)
    const newSession: AuthenticationTokens = await expectResponse(
        service.refresh(account.tokens.session.sessionId, account.tokens.refreshToken),
        (response) =>
            response.status === "ok" ?
            success(response.tokens) :
            failure(`Expected 'ok' from refresh but got ${response}`))
    expect(account.tokens.session.sessionId).not.toBe(newSession.session.sessionId)
    expect(account.tokens.refreshToken).not.toBe(newSession.refreshToken)
    const newSessionsInfo = await service.listSessions(account.tokens.session.userId)
    expect(newSessionsInfo.sessions.map(s => s.sessionId)).not.toContain(account.tokens.session.sessionId)
})

test("signout: ok", async () => {
    const account = await createSigAccount()
    await expectResponse(
        service.signout(account.tokens.session.sessionId),
        (response) =>
            response.status === "ok" ?
            success(unit) :
            failure(`Expected 'ok' from signout but got ${response}`))
    const newSessionsInfo = await service.listSessions(account.tokens.session.userId)
    expect(newSessionsInfo.sessions.map(s => s.sessionId)).not.toContain(account.tokens.session.sessionId)
})

test("resolve user: ok", async () => {
    const account = await createSigAccount()
    const userInfo: UserInfo = await expectResponse(
        service.resolveUser({ ctype: "user-id", userId: account.tokens.session.userId}),
        (response) =>
            response.status === "ok" ?
            success(response.info) :
            failure(`Expected 'ok' from resolveUser but got ${response}`))
    expect(userInfo.userId).toBe(account.tokens.session.userId)
    const userInfo2: UserInfo = await expectResponse(
        service.resolveUser({ ctype: "nickname", nickname: userInfo.nickname }),
        (response) =>
            response.status === "ok" ?
            success(response.info) :
            failure(`Expected 'ok' from resolveUser but got ${response}`))
    expect(userInfo.nickname).toBe(userInfo2.nickname)
    expect(userInfo.userId).toBe(userInfo2.userId)
})

test("resolve discord session: ok", async () => {
    const tokens = await createDiscordAccount()
    const user = await User.findOne({where: {userId: tokens.session.userId}})
    expect(user?.discordRefreshToken).toBeDefined()
    const oldRefreshToken = user?.discordRefreshToken
    const userInfo: UserFullInfo = await expectResponse(
        service.resolveSession(tokens.session.sessionId),
        (response) =>
            response.status === "ok" ?
            success(response.info) :
            failure(`Expected 'ok' from resolveUser but got ${response}`))
    expect(tokens.session.userId).toBe(userInfo.userId)
    const updatedUser = await User.findOne({where: {userId: tokens.session.userId}})
    expect(updatedUser?.discordRefreshToken).toBeDefined()
    expect(oldRefreshToken).not.toEqual(updatedUser?.discordRefreshToken)
})

test("resolve wallet session: ok", async () => {
    const account = await createSigAccount()
    const user = await User.findOne({where: {userId: account.tokens.session.userId}})
    expect(user?.discordRefreshToken).toBeDefined()
    const oldRefreshToken = user?.discordRefreshToken
    const userInfo: UserFullInfo = await expectResponse(
        service.resolveSession(account.tokens.session.sessionId),
        (response) =>
            response.status === "ok" ?
            success(response.info) :
            failure(`Expected 'ok' from resolveUser but got ${response}`))
    expect(account.tokens.session.userId).toBe(userInfo.userId)
    const updatedUser = await User.findOne({where: {userId: account.tokens.session.userId}})
    expect(updatedUser?.discordRefreshToken).toBeDefined()
    expect(oldRefreshToken).toEqual(updatedUser?.discordRefreshToken)
})

test("update user: ok", async () => {
    const account = await createSigAccount()
    const userInfo: UserInfo = await expectResponse(
        service.resolveUser({ ctype: "user-id", userId: account.tokens.session.userId}),
        (response) =>
            response.status === "ok" ?
            success(response.info) :
            failure(`Expected 'ok' from resolveUser but got ${response}`))
    await expectResponse(
        service.updateUser(account.tokens.session.userId, { nickname: "Vledic" }),
        (response) =>
            response.status === "ok" ?
            success(unit) :
            failure(`Expected 'ok' from updateUser but got ${response}`))
    const userInfo2: UserInfo = await expectResponse(
        service.resolveUser({ ctype: "user-id", userId: account.tokens.session.userId }),
        (response) =>
            response.status === "ok" ?
            success(response.info) :
            failure(`Expected 'ok' from resolveUser but got ${response}`))
    expect(userInfo2.nickname).toContain("Vledic")
    expect(userInfo.userId).toBe(userInfo2.userId)
})