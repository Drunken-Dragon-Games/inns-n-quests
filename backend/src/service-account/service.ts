import { onlyPolicies, WellKnownPolicies } from "../registry-policies"
import { AssetManagementService, ClaimerInfo, createAssociationTxResult } from "../service-asset-management"
import { PublicBallotCollection } from "../service-governance/models"
import { GovernanceService } from "../service-governance/service-spec"
import * as idenser from "../service-identity"
import { AuthenticationTokens, IdentityService } from "../service-identity"
import { MinimalUTxO } from "../tools-cardano"
import { AccountService, AuthenticateResult, ClaimDragonSilverResult, ClaimSignAndSubbmitResult, ClaimStatusResult, GetAssociationNonceResult, GetDragonSilverClaimsResult, GetUserInventoryResult, OpenBallotsResult, OpenUserBallotsResult, PublicBallotResult, SignOutResult, SubmitAssociationSignatureResult, UserBallotResult, VoteResult } from "./service-spec"

export interface AccountServiceDependencies {
    identityService: IdentityService
    assetManagementService: AssetManagementService
    governanceService: GovernanceService
    wellKnownPolicies: WellKnownPolicies
}

export class AccountServiceDsl implements AccountService {

    constructor (
        private readonly identityService: IdentityService,
        private readonly assetManagementService: AssetManagementService,
        private readonly governanceService: GovernanceService,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ){}

    static async loadFromEnv(dependencies: AccountServiceDependencies): Promise<AccountService> {
        return await AccountServiceDsl.loadFromConfig(dependencies)
    }

    static async loadFromConfig(dependencies: AccountServiceDependencies): Promise<AccountService> {
        const service = new AccountServiceDsl(
            dependencies.identityService,
            dependencies.assetManagementService,
            dependencies.governanceService,
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
        const invDragonGold = inventory[this.wellKnownPolicies.dragonGold.policyId]
        const dragonSilver = invDragonSilver?.find(a => a.chain)?.quantity ?? "0"
        const dragonGold = invDragonGold?.find(a => a.chain)?.quantity ?? "0"
        const dragonSilverToClaim = invDragonSilver?.find(a => !a.chain)?.quantity ?? "0"
        return {status: "ok", tokens, inventory: {dragonSilver, dragonSilverToClaim, dragonGold}, info: sessionResponse.info}
    }

    async getUserInventory(userId: string): Promise<GetUserInventoryResult> {
        const assetList = await this.assetManagementService.list(userId, { policies: [this.wellKnownPolicies.dragonSilver.policyId,this.wellKnownPolicies.dragonGold.policyId ] })
        if (assetList.status != "ok") return {status: "unknown-user"}
        const inventory = assetList.inventory
        const invDragonSilver = inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const invDragonGold = inventory[this.wellKnownPolicies.dragonGold.policyId]
        const dragonSilver = invDragonSilver?.find(a => a.chain)?.quantity ?? "0"
        const dragonGold = invDragonGold?.find(a => a.chain)?.quantity ?? "0"
        const dragonSilverToClaim = invDragonSilver?.find(a => !a.chain)?.quantity ?? "0"
        return {status: "ok", dragonSilver, dragonSilverToClaim, dragonGold}
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

    async getAssociationTx(userId: string, stakeAddress: string, utxos: MinimalUTxO[]): Promise<createAssociationTxResult> {
            return await this.assetManagementService.createAssociationTx(userId, stakeAddress, utxos)
    }

    async getDragonSilverClaims(userId: string, page?: number): Promise<GetDragonSilverClaimsResult> {
        const result = await this.assetManagementService.userClaims(userId, "DragonSilver", page)
        if (result.status == "ok")
            return { status: "ok", claims: result.claims.map(claim => ({
                claimId: claim.claimId,
                quantity: claim.quantity,
                state: claim.state,
                txId: claim.txId,
                createdAt: claim.createdAt, 
            })) }
        else 
            return result
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

    async getOpenBallots(): Promise<OpenBallotsResult> {
        const openBallotsResult = await this.governanceService.getBallots("open")
        if (openBallotsResult.ctype !== "success") return {status: "invalid", reason: openBallotsResult.reason}
        return {status: "ok", payload: openBallotsResult.ballots}
    }

    async getUserOpenBallots(userId: string): Promise<OpenUserBallotsResult> {
        const openUserBallotsResult = await this.governanceService.getUserOpenBallots(userId)
        if (openUserBallotsResult.ctype !== "success") return {status: "invalid", reason: openUserBallotsResult.reason}
        return {status: "ok", payload: openUserBallotsResult.ballots}
    }

    async getPublicBallots(): Promise<PublicBallotResult> {
        const openBallotsResult = await this.governanceService.getPublicBallotCollection()
        if (openBallotsResult.ctype !== "success") return {status: "invalid", reason: openBallotsResult.reason}
        return {status: "ok", payload: openBallotsResult.ballots}
    }

    async getUserBallots(userId: string):Promise<UserBallotResult> {
        const openUserBallotsResult = await this.governanceService.getUserBallotCollection(userId)
        if (openUserBallotsResult.ctype !== "success") return {status: "invalid", reason: openUserBallotsResult.reason}
        return {status: "ok", payload: openUserBallotsResult.ballots}
    }

    async voteForBallot(userId: string, ballotId: string, optionIndex: number): Promise<VoteResult> {
        const dgPolicyId = this.wellKnownPolicies.dragonGold.policyId
        const listResponse = await this.assetManagementService.list(userId, {chain: true,  policies: [ dgPolicyId ]})
        if (listResponse.status !== "ok") return {status: "invalid", reason: listResponse.status}
        const dragonGold = listResponse.inventory[dgPolicyId][0].quantity
        //CHECKME: currenlty hanlding draonGold as number, is posible it will need to be changed to a bigInt
        const voteResult = await this.governanceService.voteForBallot(ballotId, optionIndex, userId, dragonGold)
        if (voteResult.ctype !== "success") return {status: "invalid", reason: voteResult.reason}
        return {status: "ok"}
    }
}

