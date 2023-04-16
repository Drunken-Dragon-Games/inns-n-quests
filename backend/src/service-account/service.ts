import { onlyPolicies, WellKnownPolicies } from "../registry-policies"
import { AssetManagementService, ClaimerInfo } from "../service-asset-management"
import * as idenser from "../service-identity"
import { AuthenticationTokens, IdentityService } from "../service-identity"
import { AccountService, AuthenticateResult, ClaimDragonSilverResult, ClaimSignAndSubbmitResult, ClaimStatusResult, GetAssociationNonceResult, getUserInventoryResult, SignOutResult, SubmitAssociationSignatureResult } from "./service-spec"

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

    async getUserInventory(userId: string): Promise<getUserInventoryResult> {
        const assetList = await this.assetManagementService.list(userId, { policies: onlyPolicies(this.wellKnownPolicies) })
        if (assetList.status != "ok") return {status: "unknown-user"}
        const inventory = assetList.inventory
        const invDragonSilver = inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const dragonSilver = parseInt(invDragonSilver?.find(a => a.chain)?.quantity ?? "0")
        const dragonSilverToClaim = parseInt(invDragonSilver?.find(a => !a.chain)?.quantity ?? "0")
        return {status: "ok", dragonSilver, dragonSilverToClaim}
    }

    async getAssociationNonce(stakeAddress: string): Promise<GetAssociationNonceResult> {
        return await this.identityService.createSigNonce(stakeAddress)
    }

    async submitAssociationSignature(userId: string, nonce: string, publicKey: string, signature: string){
        const associateResponse = await this.identityService.associate(userId, 
            {ctype: "sig", deviceType: "Browser", publicKey, nonce, signedNonce: signature })
        if (associateResponse.status == "discord-used") throw new Error("Discord accounts should not affect here.")
        return associateResponse
    }

    async claimDragonSilver(userId: string, stakeAddress: string, claimerInfo: ClaimerInfo): Promise<ClaimDragonSilverResult>{
        const dsPolicyId = this.wellKnownPolicies.dragonSilver.policyId
        //For now we just claim ALL OF IT
        //const { amount } = request.body
        const assetList = await this.assetManagementService.list(userId, { policies: [ dsPolicyId ] })
        if (assetList.status == "ok"){
            const inventory= assetList.inventory
            const dragonSilverToClaim = inventory[dsPolicyId!].find(i => i.chain === false)?.quantity ?? "0"
            const options = {
                unit: "DragonSilver",
                policyId: dsPolicyId,
                quantity: dragonSilverToClaim
            }
            const claimResponse = await this.assetManagementService.claim(userId, stakeAddress, options, claimerInfo)
            if (claimResponse.status == "ok") return { ...claimResponse, remainingAmount: 0 }
            else return { ...claimResponse, remainingAmount: parseInt(dragonSilverToClaim) }
        }
        else return { status: "invalid", reason: assetList.status}
    }

    async claimSignAndSubbmit(witness: string, tx: string, claimId: string): Promise<ClaimSignAndSubbmitResult> {
        return this.assetManagementService.submitClaimSignature(claimId, tx, witness)
    }

    async claimStatus(claimId: string): Promise<ClaimStatusResult> {
        return this.assetManagementService.claimStatus(claimId)
    }

    async grantTest(userId: string): Promise<void>{
        if (process.env.NODE_ENV !== "development") return 
        this.assetManagementService.grant(userId, {policyId: this.wellKnownPolicies.dragonSilver.policyId, unit: "DragonSilver", quantity: "10"})
    }
}

