import { onlyPolicies, WellKnownPolicies } from "../registry-policies"
import { AssetManagementService } from "../service-asset-management"
import * as idenser from "../service-identity"
import { AuthenticationTokens, IdentityService } from "../service-identity"
import { AccountService, AuthenticateResult, GetAssociationNonceResult, SignOutResult, SubmitAssociationSignatureResult } from "./service-spec"

export interface AccountServiceDependencies {
    identityService: IdentityService
    assetManagementService: AssetManagementService
    wellKnownPolicies: WellKnownPolicies
}

export class AccountServiceDsl implements AccountService {

    constructor (
        private readonly identityService: IdentityService,
        private readonly assetManagementService: AssetManagementService,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ){}

    static async loadFromEnv(dependencies: AccountServiceDependencies): Promise<AccountService> {
        return await AccountServiceDsl.loadFromConfig(dependencies)
    }

    static async loadFromConfig(dependencies: AccountServiceDependencies): Promise<AccountService> {
        const service = new AccountServiceDsl(
            dependencies.identityService,
            dependencies.assetManagementService,
            dependencies.wellKnownPolicies,
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
    }

    async unloadDatabaseModels(): Promise<void> {
    }

    async authenticateDevelopment(nickname: string): Promise<AuthenticateResult> {
        const credentials: idenser.Credentials = {ctype: "development", deviceType: "Browser", nickname }
        const authResponse = await this.identityService.authenticate(credentials)
        if (authResponse.status != "ok") return authResponse
        return await this.resolveSessionFromTokens(authResponse.tokens)
    }

    async authenticateDiscord(code: string): Promise<AuthenticateResult> {
        const credentials: idenser.Credentials = {ctype: "discord", deviceType: "Browser", authCode: code }
        const authResponse = await this.identityService.authenticate(credentials)
        if (authResponse.status != "ok") return authResponse
        return await this.resolveSessionFromTokens(authResponse.tokens)
    }

    async signout(sessionId: string): Promise<SignOutResult> {
        return this.identityService.signout(sessionId)
    }

    async refreshSession(sessionId: string, refreshToken: string): Promise<AuthenticateResult> {
        const refreshResult = await this.identityService.refresh(sessionId, refreshToken)
        if (refreshResult.status != "ok") return { status: "bad-credentials" }
        return await this.resolveSessionFromTokens(refreshResult.tokens)
    }

    private async resolveSessionFromTokens(tokens: AuthenticationTokens): Promise<AuthenticateResult> {
        const sessionResponse = await this.identityService.resolveSession(tokens.session.sessionId)
        if (sessionResponse.status != "ok") return {status: "unknown-user"}
        const assetList = await this.assetManagementService.list(tokens.session.userId, { policies: onlyPolicies(this.wellKnownPolicies) })
        if (assetList.status != "ok") return {status: "unknown-user"}
        const inventory = assetList.inventory
        const invDragonSilver = inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const dragonSilver = parseInt(invDragonSilver?.find(a => a.chain)?.quantity ?? "0")
        const dragonSilverToClaim = parseInt(invDragonSilver?.find(a => !a.chain)?.quantity ?? "0")
        return {status: "ok", tokens, inventory: {dragonSilver, dragonSilverToClaim}, info: sessionResponse.info}
    }

    async getAssociationNonce(stakeAddress: string): Promise<GetAssociationNonceResult> {
        return await this.identityService.createSigNonce(stakeAddress)
    }

    async submitAssociationSignature(userId: string, nonce: string, publicKey: string, signature: string): Promise<SubmitAssociationSignatureResult> {
        const associateResponse = await this.identityService.associate(userId, 
            {ctype: "sig", deviceType: "Browser", publicKey, nonce, signedNonce: signature })
        if (associateResponse.status == "discord-used") throw new Error("Discord accounts should not affect here.")
        return associateResponse
    }
}
