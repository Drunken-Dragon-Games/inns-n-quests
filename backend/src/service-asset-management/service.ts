import dotenv from "dotenv"
import { AssetManagementService } from "./service-spec"
import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { QueryInterface, Sequelize } from "sequelize"
import { AssetStoreDsl } from "./assets/assets-dsl"
import { IdentityService } from "../service-identity"
import { SecureSigningService } from "../service-secure-signing"
import { AssetClaimDsl, AssetClaimDslConfig } from "./assets/asset-claim-dsl"
import { LoggingContext } from "../tools-tracing"
import { buildMigrator } from "../tools-database"
import { config } from "../tools-utils"
import path from "path"
import { Umzug } from "umzug"
import { AssetManagementServiceLogging } from "./logging"

import { 
    ClaimResponse, ClaimStatusResponse, ClaimerInfo, GrantResponse, HealthStatus, 
    ListResponse, LucidClaimResponse, LucidReportSubmissionResponse, SubmitAuthTransactionResult, SubmitClaimSignatureResponse, UserClaimsResponse 
} from "./models"

import * as offChainStoreDB from "./assets/offchain-store-db"
import * as assetClaimDB from "./assets/asset-claim-db"
import { MinimalUTxO } from "../tools-cardano"
import { BlockchainService } from "../service-blockchain/service-spec"
//import { Lucid } from "lucid-cardano"

export interface AssetManagementServiceConfig 
    { claimsConfig: AssetClaimDslConfig
    }

export interface AssetManagemenetServiceDependencies 
    { database: Sequelize
    , blockfrost: BlockFrostAPI
    , identityService: IdentityService
    , secureSigningService: SecureSigningService
    , blockchainService: BlockchainService
    }

export class AssetManagementServiceDsl implements AssetManagementService {

    private readonly assets: AssetStoreDsl
    private readonly claims: AssetClaimDsl
    private readonly migrator: Umzug<QueryInterface>

    constructor (
        assetClaimConfig: AssetClaimDslConfig,
        private readonly database: Sequelize,
        blockfrost: BlockFrostAPI,
        private readonly identityService: IdentityService,
        secureSigningService: SecureSigningService,
        private readonly blockchainService: BlockchainService,
    ) {
        this.assets = new AssetStoreDsl(blockfrost)
        this.claims = new AssetClaimDsl(assetClaimConfig, database, blockfrost, secureSigningService, this.assets, this.blockchainService)//, lucid)
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: AssetManagemenetServiceDependencies): Promise<AssetManagementService> {
        dotenv.config()
        return await AssetManagementServiceDsl.loadFromConfig(
            { claimsConfig: 
                { feeAddress: config.stringOrElse("CLAIM_FEE_ADDRESS", "addr_test1qq4e7rcz9c95shmxale22rkd5flqp2ft7kfvg8mmt7829g5e4ruvq60uyzc0e0u988ypdn96y9jfstgj0xumdt60sekq3wydq9")
                , feeAmount: config.stringOrElse("CLAIM_FEE_AMOUNT", "1000000")
                , txTTL: config.intOrElse("CLAIM_TX_TTL", 15 * 60)
                }
            }, dependencies)
    }

    static async loadFromConfig(servConfig: AssetManagementServiceConfig, dependencies: AssetManagemenetServiceDependencies): Promise<AssetManagementService> {
        const service = new AssetManagementServiceLogging(new AssetManagementServiceDsl(
            servConfig.claimsConfig,
            dependencies.database,
            dependencies.blockfrost,
            dependencies.identityService,
            dependencies.secureSigningService,
            dependencies.blockchainService
        ))
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        offChainStoreDB.configureSequelizeModel(this.database)
        assetClaimDB.configureSequelizeModel(this.database)
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
        return {
            status: "ok",
            dependencies: [{ name: "database", status: dbHealth }]
        }
    }

    async list(userId: string, options: { count?: number, page?: number, chain?: boolean, policies: string[] }, logger?: LoggingContext, ): Promise<ListResponse> {
        const userInfo = await this.identityService.resolveUser({ ctype: "user-id", userId }, logger)
        if (userInfo.status == "unknown-user-id") return { status: "unknown-user" }
        const inventory = await this.assets.list(userId, userInfo.info.knownStakeAddresses, 
            { count: options?.count ?? 100, page: options?.page ?? 0, chain: options?.chain, policies: options.policies })
        return { status: "ok", inventory }
    }

    async grant(userId: string, assets: { unit: string, policyId: string, quantity: string }, logger: LoggingContext): Promise<GrantResponse> {
        await this.assets.grant(userId, assets.unit, assets.policyId, assets.quantity)
        return { status: "ok" }
    }

    async grantMany(userId: string, assets: { unit: string, policyId: string, quantity: string }[], logger: LoggingContext): Promise<GrantResponse> {
        await Promise.all(assets.map(a => this.assets.grant(userId, a.unit, a.policyId, a.quantity)))
        return { status: "ok" }
    }

	async userClaims(userId: string, unit: string, page?: number, logger?: LoggingContext): Promise<UserClaimsResponse> {
        const result = await this.claims.userClaims(userId, unit, page, logger)
        return { status: "ok", claims: result }
    }

    async claim(userId: string, stakeAddress: string, address: string, assets: { unit: string, policyId: string, quantity?: string }, logger?: LoggingContext): Promise<ClaimResponse> {
        const result = await this.claims.claim(userId, stakeAddress,address, assets, logger)
        if (result.ctype == "success") 
            return { status: "ok", claimId: result.claimId, tx: result.tx }
        else {
            return { status: "invalid", reason: result.error }        
        }
    }

    //DEPRECATED
    async createAssociationTx(stakeAddress: string, MinimalUTxOs: MinimalUTxO[], logger?: LoggingContext | undefined): Promise<SubmitClaimSignatureResponse> {
        const result = await this.claims.genAssoiateTx(stakeAddress, MinimalUTxOs, logger)
        if (result.ctype == "success")
            return { status: "ok", txId: result.txId }
        else {
            return { status: "invalid", reason: result.error }
        }
    }

    //DEPRECATED
    async submitAuthTransaction(witness: string, tx: string, logger?: LoggingContext | undefined): Promise<SubmitAuthTransactionResult> {
        const result = await this.claims.submitAssoiateTx(witness, tx)
        if (result.ctype !== "success") return { status: "invalid", reason: result.error }
        return { status: "ok", txId: result.txId }

    } 

    async submitClaimSignature(claimId: string, serializedSignedTx: string, logger?: LoggingContext): Promise<SubmitClaimSignatureResponse> {
        const result = await this.claims.submitClaimSignature(claimId, serializedSignedTx, logger)
        if (result.ctype == "success") 
            return { status: "ok", txId: result.txId }
        else 
            return { status: "invalid", reason: result.error }
    }

    async claimStatus(claimId: string, logger?: LoggingContext): Promise<ClaimStatusResponse> {
        const result = await this.claims.claimStatus(claimId, logger)
        if (result.ctype == "success") 
            return { status: "ok", claimStatus: result.status }
        else 
            return { status: "invalid", reason: result.error }
    }

    async revertStaledClaims(logger?: LoggingContext): Promise<number> {
        return await this.claims.revertStaledClaims(logger)
    }
}
