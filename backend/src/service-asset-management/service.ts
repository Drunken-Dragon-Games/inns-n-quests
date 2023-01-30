import dotenv from "dotenv"
import { AssetManagementService } from "./service-spec"
import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import { QueryInterface, Sequelize } from "sequelize"
import Registry from "./registry/registry"
import { AssetStoreDsl } from "./assets/assets-dsl"
import { IdentityService } from "../service-identity"
import { SecureSigningService } from "../service-secure-signing"
import { AssetClaimDsl, AssetClaimDslConfig } from "./assets/asset-claim-dsl"
import { CardanoNetwork } from "../tools-cardano"
import { LoggingContext } from "../tools-tracing"
import { buildMigrator } from "../tools-database"
import { config } from "../tools-utils"
import path from "path"
import { Umzug } from "umzug"
import { AssetManagementServiceLogging } from "./logging"

import { 
    ClaimResponse, ClaimStatusResponse, GrantResponse, HealthStatus, 
    ListResponse, RegistryPolicy, SubmitClaimSignatureResponse 
} from "./models"

import * as offChainStoreDB from "./assets/offchain-store-db"
import * as assetClaimDB from "./assets/asset-claim-db"

export interface AssetManagementServiceConfig 
    { network: CardanoNetwork
    , environment: string
    , claimsConfig: AssetClaimDslConfig
    }

export interface AssetManagemenetServiceDependencies 
    { database: Sequelize
    , blockfrost: BlockFrostAPI
    , identityService: IdentityService
    , secureSigningService: SecureSigningService
    }

export class AssetManagementServiceDsl implements AssetManagementService {

    private readonly registryM: Registry
    private readonly assets: AssetStoreDsl
    private readonly claims: AssetClaimDsl
    private readonly migrator: Umzug<QueryInterface>

    constructor (
        private readonly network: CardanoNetwork,
        private readonly assetClaimConfig: AssetClaimDslConfig,
        private readonly database: Sequelize,
        private readonly blockfrost: BlockFrostAPI,
        private readonly identityService: IdentityService,
        private readonly secureSigningService: SecureSigningService,
    ) {
        this.registryM = new Registry(network)
        this.assets = new AssetStoreDsl(blockfrost, this.registryM)
        this.claims = new AssetClaimDsl(assetClaimConfig, database, blockfrost, secureSigningService, this.assets)
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: AssetManagemenetServiceDependencies): Promise<AssetManagementService> {
        dotenv.config()
        return await AssetManagementServiceDsl.loadFromConfig(
            { network: config.stringOrElse("CARDANO_NETWORK", "testnet") as CardanoNetwork
            , environment: config.stringOrElse("ENVIRONMENT", "local")
            , claimsConfig: 
                { feeAddress: config.stringOrElse("CLAIM_FEE_ADDRESS", "addr_test1qq4e7rcz9c95shmxale22rkd5flqp2ft7kfvg8mmt7829g5e4ruvq60uyzc0e0u988ypdn96y9jfstgj0xumdt60sekq3wydq9")
                , feeAmount: config.stringOrElse("CLAIM_FEE_AMOUNT", "1000000")
                , txTTL: config.intOrElse("CLAIM_TX_TTL", 15 * 60)
                }
            }, dependencies)
    }

    static async loadFromConfig(servConfig: AssetManagementServiceConfig, dependencies: AssetManagemenetServiceDependencies): Promise<AssetManagementService> {
        const service = new AssetManagementServiceLogging(new AssetManagementServiceDsl(
            servConfig.network,
            servConfig.claimsConfig,
            dependencies.database,
            dependencies.blockfrost,
            dependencies.identityService,
            dependencies.secureSigningService,
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

    async registry(logger?: LoggingContext): Promise<RegistryPolicy[]> {
        return Promise.resolve(this.registryM.list())
    }

    async list(userId: string, logger?: LoggingContext, options?: { count?: number, page?: number, chain?: boolean , policies?: string[] }): Promise<ListResponse> {
        const userInfo = await this.identityService.resolveUser({ ctype: "user-id", userId }, logger)
        if (userInfo.status == "unknown-user-id") return { status: "unknown-user" }
        const inventory = await this.assets.list(userId, userInfo.info.knownStakeAddresses, 
            { count: options?.count ?? 100, page: options?.page ?? 0, chain: options?.chain, policies: options?.policies })
        return { status: "ok", inventory }
    }

    async grant(userId: string, assets: { unit: string, policyId: string, quantity: string }, logger: LoggingContext): Promise<GrantResponse> {
        if (!this.registryM.list().map(p => p.policyId).includes(assets.policyId)) 
            return { status: "invalid", reason: "unknown policy id" }
        await this.assets.grant(userId, assets.unit, assets.policyId, assets.quantity)
        return { status: "ok" }
    }

    async claim(userId: string, stakeAddress: string, assets: { unit: string, policyId: string, quantity?: string }, logger?: LoggingContext): Promise<ClaimResponse> {
        const result = await this.claims.claim(userId, stakeAddress, assets, logger)
        if (result.ctype == "success") 
            return { status: "ok", claimId: result.result.claimId, tx: result.result.tx }
        else {
            return { status: "invalid", reason: result.error }        
        }
    }

    async submitClaimSignature(claimId: string, tx: string, witness: string, logger?: LoggingContext): Promise<SubmitClaimSignatureResponse> {
        const result = await this.claims.submitClaimSignature(claimId, tx, witness, logger)
        if (result.ctype == "success") 
            return { status: "ok", txId: result.result }
        else 
            return { status: "invalid", reason: result.error }
    }

    async claimStatus(claimId: string, logger?: LoggingContext): Promise<ClaimStatusResponse> {
        const result = await this.claims.claimStatus(claimId, logger)
        if (result.ctype == "success") 
            return { status: "ok", claimStatus: result.result }
        else 
            return { status: "invalid", reason: result.error }
    }

    async revertStaledClaims(logger?: LoggingContext): Promise<number> {
        return await this.claims.revertStaledClaims(logger)
    }
}
