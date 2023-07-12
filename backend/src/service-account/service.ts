import { onlyPolicies, WellKnownPolicies } from "../tools-assets/registry-policies"
import { AssetManagementService, ClaimerInfo } from "../service-asset-management"
import { BlockchainService } from "../service-blockchain/service-spec"
import { GovernanceService } from "../service-governance/service-spec"
import * as idenser from "../service-identity"
import { AuthenticationTokens, IdentityService } from "../service-identity"
import { MinimalUTxO } from "../tools-cardano"
import { LoggingContext } from "../tools-tracing"
import { AccountService, AuthenticateResult, ClaimDragonSilverResult, ClaimSignAndSubbmitResult, ClaimStatusResult, CleanAssociationTxResult, CreateAssociationTxResult, DeassociationResult, GetAssociationNonceResult, GetDragonSilverClaimsResult, GetUserInventoryResult, OpenBallotsResult, OpenUserBallotsResult, PublicBallotResult, SignOutResult, SubmitAssociationSignatureResult, UserBallotResult, VoteResult } from "./service-spec"
import { CollectionService } from "../service-collection"

export interface AccountServiceDependencies {
    identityService: IdentityService
    assetManagementService: AssetManagementService
    blockchainService: BlockchainService
    governanceService: GovernanceService
    collectionService: CollectionService
    wellKnownPolicies: WellKnownPolicies
}

export class AccountServiceDsl implements AccountService {

    constructor (
        private readonly identityService: IdentityService,
        private readonly assetManagementService: AssetManagementService,
        private readonly blockchainService: BlockchainService,
        private readonly governanceService: GovernanceService,
        private readonly collectionService: CollectionService,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ){}

    static async loadFromEnv(dependencies: AccountServiceDependencies): Promise<AccountService> {
        return await AccountServiceDsl.loadFromConfig(dependencies)
    }

    static async loadFromConfig(dependencies: AccountServiceDependencies): Promise<AccountService> {
        const service = new AccountServiceDsl(
            dependencies.identityService,
            dependencies.assetManagementService,
            dependencies.blockchainService,
            dependencies.governanceService,
            dependencies.collectionService,
            dependencies.wellKnownPolicies,
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
    }

    async unloadDatabaseModels(): Promise<void> {
    }

    async authenticateDevelopment(nickname: string, logger?: LoggingContext): Promise<AuthenticateResult> {
        const credentials: idenser.Credentials = {ctype: "development", deviceType: "Browser", nickname }
        const authResponse = await this.identityService.authenticate(credentials, logger)
        if (authResponse.status != "ok") return authResponse
        return await this.resolveSessionFromTokens(authResponse.tokens)
    }

    async authenticateDiscord(code: string, logger?: LoggingContext): Promise<AuthenticateResult> {
        const credentials: idenser.Credentials = {ctype: "discord", deviceType: "Browser", authCode: code }
        const authResponse = await this.identityService.authenticate(credentials, logger)
        if (authResponse.status != "ok") return authResponse
        return await this.resolveSessionFromTokens(authResponse.tokens, logger)
    }

    async signout(sessionId: string, logger?: LoggingContext): Promise<SignOutResult> {
        return this.identityService.signout(sessionId, logger)
    }

    async refreshSession(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<AuthenticateResult> {
        const refreshResult = await this.identityService.refresh(sessionId, refreshToken, logger)
        if (refreshResult.status != "ok") return { status: "bad-credentials" }
        return await this.resolveSessionFromTokens(refreshResult.tokens, logger)
    }

    private async resolveSessionFromTokens(tokens: AuthenticationTokens, logger?: LoggingContext): Promise<AuthenticateResult> {
        const sessionResponse = await this.identityService.resolveSession(tokens.session.sessionId, logger)
        if (sessionResponse.status != "ok") return {status: "unknown-user"}
        const assetList = await this.assetManagementService.list(tokens.session.userId, { policies: onlyPolicies(this.wellKnownPolicies) }, logger)
        if (assetList.status != "ok") return {status: "unknown-user"}
        const inventory = assetList.inventory
        const invDragonSilver = inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const invDragonGold = inventory[this.wellKnownPolicies.dragonGold.policyId]
        const dragonSilver = invDragonSilver?.find(a => a.chain)?.quantity ?? "0"
        const dragonGold = invDragonGold?.find(a => a.chain)?.quantity ?? "0"
        const dragonSilverToClaim = invDragonSilver?.find(a => !a.chain)?.quantity ?? "0"
        return {status: "ok", tokens, inventory: {dragonSilver, dragonSilverToClaim, dragonGold}, info: sessionResponse.info}
    }

    async getUserInventory(userId: string, logger?: LoggingContext): Promise<GetUserInventoryResult> {
        const assetList = await this.assetManagementService.list(userId, { policies: [this.wellKnownPolicies.dragonSilver.policyId,this.wellKnownPolicies.dragonGold.policyId ] }, logger)
        if (assetList.status != "ok") return {status: "unknown-user"}
        const inventory = assetList.inventory
        const invDragonSilver = inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const invDragonGold = inventory[this.wellKnownPolicies.dragonGold.policyId]
        const dragonSilver = invDragonSilver?.find(a => a.chain)?.quantity ?? "0"
        const dragonGold = invDragonGold?.find(a => a.chain)?.quantity ?? "0"
        const dragonSilverToClaim = invDragonSilver?.find(a => !a.chain)?.quantity ?? "0"
        return {status: "ok", dragonSilver, dragonSilverToClaim, dragonGold}
    }

    async getAssociationNonce(stakeAddress: string, logger?: LoggingContext): Promise<GetAssociationNonceResult> {
        return await this.identityService.createSigNonce(stakeAddress, logger)
    }

    async submitAssociationSignature(userId: string, nonce: string, publicKey: string, signature: string, logger?: LoggingContext): Promise<SubmitAssociationSignatureResult> {
        const associateResponse = await this.identityService.associate(userId, 
            {ctype: "sig", deviceType: "Browser", publicKey, nonce, signedNonce: signature }, logger)
        if (associateResponse.status == "discord-used") throw new Error("Discord accounts should not affect here.")
        return associateResponse
    }

    async getAssociationTx(userId: string, stakeAddress: string, address: string, logger?: LoggingContext): Promise<CreateAssociationTxResult> {

            const transactionInfoResponse = await this.blockchainService.getWalletAuthenticationSelfTx(address)
            if (transactionInfoResponse.status !== "ok") return {status: "invalid", reason: `While building TX: ${transactionInfoResponse.reason}`}

            const transactionInfo = transactionInfoResponse.value

            const authState =  await this.identityService.createAuthTxState(userId, stakeAddress, transactionInfo.txHash, logger)
            if (authState.status != "ok") return {status: "invalid", reason: `While creating auth State ${authState.reason}`}

            return { status: "ok", rawTx: transactionInfo.rawTransaction, authStateId: authState.authStateId}
    }

    async submitAssociationTx(userId: string, serializedSignedTx: string, authStateId: string, logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult> {
        try {
            const txHashResponse = await this.blockchainService.getTxHashFromTransaction(serializedSignedTx)
            if(txHashResponse.status !== "ok") return {status: "invalid", reason: `could not hash Transaction: ${txHashResponse.reason}`}
            const stateValidateResult = await this.identityService.verifyAuthState(authStateId, userId, txHashResponse.value, logger)
            if (stateValidateResult.status !== "ok") throw new Error(stateValidateResult.reason)
            const txSubmitResult = await this.blockchainService.submitTransaction(serializedSignedTx)
            if (txSubmitResult.status != "ok") throw new Error(txSubmitResult.reason)
            if(txSubmitResult.value !== txHashResponse.value) throw new Error(`Could not match Submited and signed Transactions`)
            const associateResponse = await this.identityService.associate(userId, 
                {ctype: "tx", deviceType: "Browser", stakekeAddres: stateValidateResult.stakeAddress}, logger)
            if(associateResponse.status != "ok") throw new Error(associateResponse.status)
            await this.identityService.completeAuthState(authStateId, {ctype: "succeded"})
            return{status: "ok", txId: txSubmitResult.value }
        }catch(e: any){
            logger?.log.error(e.message ?? e)
            await this.identityService.completeAuthState(authStateId, {ctype: "failed", reason: e.message})
            return {status: "invalid", reason: e.message}
        }
        
    }

    async cleanAssociationState(authStateId: string, error: string, logger?: LoggingContext): Promise<CleanAssociationTxResult> {
        return await this.identityService.completeAuthState(authStateId, {ctype: "failed", reason: `frontend exception: ${error}`})
    }

    async deassociateWallet(userId: string, stakeAddress: string, logger?: LoggingContext | undefined): Promise<DeassociationResult> {
        return await this.identityService.deassociateWallet(userId, stakeAddress, logger)
    }

    async getDragonSilverClaims(userId: string, page?: number, logger?: LoggingContext): Promise<GetDragonSilverClaimsResult> {
        const result = await this.assetManagementService.userClaims(userId, "DragonSilver", page, logger)
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

    async claimDragonSilver(userId: string, stakeAddress: string, address: string, logger?: LoggingContext): Promise<ClaimDragonSilverResult>{
        const dsPolicyId = this.wellKnownPolicies.dragonSilver.policyId
        //For now we just claim ALL OF IT
        //const { amount } = request.body
        const assetList = await this.assetManagementService.list(userId, { policies: [ dsPolicyId ] }, logger)
        if (assetList.status !== "ok") return { status: "invalid", reason: assetList.status}
        const inventory= assetList.inventory
        const dragonSilverToClaim = inventory[dsPolicyId!].find(i => i.chain === false)?.quantity ?? "0"
        const options = {
            unit: "DragonSilver",
            policyId: dsPolicyId,
            quantity: dragonSilverToClaim
        }
        const claimResponse = await this.assetManagementService.claim(userId, stakeAddress, address, options, logger)
        if (claimResponse.status == "ok") return { ...claimResponse, remainingAmount: 0 }
        else return { ...claimResponse, remainingAmount: parseInt(dragonSilverToClaim) }
        
    }

    async claimSignAndSubbmit(serializedSignedTx: string, claimId: string, logger?: LoggingContext): Promise<ClaimSignAndSubbmitResult> {
        return this.assetManagementService.submitClaimSignature(claimId, serializedSignedTx, logger)
    }

    async claimStatus(claimId: string, logger?: LoggingContext): Promise<ClaimStatusResult> {
        return this.assetManagementService.claimStatus(claimId, logger)
    }

    async grantTest(userId: string, logger?: LoggingContext): Promise<void>{
        if (process.env.NODE_ENV !== "development") return 
        this.assetManagementService.grant(userId, {policyId: this.wellKnownPolicies.dragonSilver.policyId, unit: "DragonSilver", quantity: "10"}, logger)
    }

    async getOpenBallots(logger?: LoggingContext): Promise<OpenBallotsResult> {
        const openBallotsResult = await this.governanceService.getBallots("open")
        if (openBallotsResult.ctype !== "success") return {status: "invalid", reason: openBallotsResult.reason}
        return {status: "ok", payload: openBallotsResult.ballots}
    }

    async getUserOpenBallots(userId: string, logger?: LoggingContext): Promise<OpenUserBallotsResult> {
        const openUserBallotsResult = await this.governanceService.getUserOpenBallots(userId)
        if (openUserBallotsResult.ctype !== "success") return {status: "invalid", reason: openUserBallotsResult.reason}
        return {status: "ok", payload: openUserBallotsResult.ballots}
    }

    async getPublicBallots(logger?: LoggingContext): Promise<PublicBallotResult> {
        const openBallotsResult = await this.governanceService.getPublicBallotCollection()
        if (openBallotsResult.ctype !== "success") return {status: "invalid", reason: openBallotsResult.reason}
        return {status: "ok", payload: openBallotsResult.ballots}
    }

    async getUserBallots(userId: string, logger?: LoggingContext):Promise<UserBallotResult> {
        const openUserBallotsResult = await this.governanceService.getUserBallotCollection(userId)
        if (openUserBallotsResult.ctype !== "success") return {status: "invalid", reason: openUserBallotsResult.reason}
        return {status: "ok", payload: openUserBallotsResult.ballots}
    }

    async voteForBallot(userId: string, ballotId: string, optionIndex: number, logger?: LoggingContext): Promise<VoteResult> {
        const dgPolicyId = this.wellKnownPolicies.dragonGold.policyId
        const listResponse = await this.assetManagementService.list(userId, {chain: true,  policies: [ dgPolicyId ]})
        if (listResponse.status !== "ok") return {status: "invalid", reason: listResponse.status}
        const dragonGold = listResponse.inventory[dgPolicyId] ? listResponse.inventory[dgPolicyId][0].quantity : "0"
        //CHECKME: currenlty hanlding draonGold as number, is posible it will need to be changed to a bigInt
        const voteResult = await this.governanceService.voteForBallot(ballotId, optionIndex, userId, dragonGold)
        if (voteResult.ctype !== "success") return {status: "invalid", reason: voteResult.reason}
        return {status: "ok"}
    }
}

