import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import dotenv from 'dotenv'
import { setTimeout } from "timers/promises"
import { buildApp } from "./module-ddu-app/app"
import { PORT } from "./module-ddu-app/settings"
import { AssetManagementService } from "./service-asset-management"
import { AssetManagementServiceDsl } from "./service-asset-management/service"
import { IdentityServiceDsl } from "./service-identity"
import { IdleQuestsServiceDsl } from "./service-idle-quests/service"
import { SecureSigningServiceDsl } from "./service-secure-signing"
import { connectToDB } from "./tools-database"
import { LoggingContext } from "./tools-tracing"
import { config } from "./tools-utils"

import path from "path"
import { loadMetadataCache, loadMetadataLocationsFromEnv } from "./registry-metadata"
import { loadWellKnownPoliciesFromEnv, wellKnownPoliciesMainnet } from "./registry-policies"
import { loadQuestRegistry } from "./service-idle-quests/state/staking-quests-registry"
import { EvenstatsServiceDsl } from "./service-evenstats/service"
import { KiliaBotServiceDsl } from "./service-kilia-bot"
import { commonCalendar } from "./tools-utils/calendar"
import { AccountServiceDsl } from "./service-account"
import { cardanoNetworkFromString } from "./tools-cardano"
import { GovernanceServiceDsl } from "./service-governance/service"
import { BlockchainServiceDsl } from "./service-blockchain/service"

async function revertStaledClaimsLoop(assetManagementService: AssetManagementService, logger: LoggingContext) {
    await setTimeout(1000 * 60)
    const amountReverted = await assetManagementService.revertStaledClaims(logger)
    if (amountReverted > 0)
        logger.info(`Reverted ${amountReverted} staled claims`)
    await revertStaledClaimsLoop(assetManagementService, logger)
}

(async () => {
    console.log("Starting backend...")
    dotenv.config()
    const randomSeed = config.stringOrElse("RANDOM_SEED", Date.now().toString())
    const calendar = commonCalendar
    const metadataRegistry = await loadMetadataCache(loadMetadataLocationsFromEnv())
    const wellKnownPolicies = process.env.CARDANO_NETWORK === "Mainnet" ? wellKnownPoliciesMainnet : loadWellKnownPoliciesFromEnv()
    const questsRegistry = await loadQuestRegistry(
        config.stringOrElse("QUEST_REGISTRY_LOCATION", path.join(__dirname, "..", "stubs", "test-quest-registry.yaml")), 
        config.typeOrElse("QUEST_REGISTRY_FORMAT", "yaml", (obj: any): obj is "yaml" | "json" => obj === "yaml" || obj === "json"), 
    )
    const network = cardanoNetworkFromString(config.stringOrElse("CARDANO_NETWORK", "Preprod"))
    const blockfrostApiKey = config.stringOrError("BLOCKFROST_API_KEY")
    const blockfrost = new BlockFrostAPI({ projectId: blockfrostApiKey })    
    const database = connectToDB({ 
        host: config.stringOrError("DB_HOST"),
        port: config.intOrError("DB_PORT"),
        sslCertPath: config.stringOrUndefined("DB_SSL_CERT_PATH"),
        username: config.stringOrError("DB_USERNAME"),
        password: config.stringOrError("DB_PASSWORD"),
        database: config.stringOrError("DB_DATABASE"),
    })
    const blockchainService = BlockchainServiceDsl.loadFromEnv()
    const evenstatsService = await EvenstatsServiceDsl.loadFromEnv({ database })
    const identityService = await IdentityServiceDsl.loadFromEnv({ database })
    const governanceService = await GovernanceServiceDsl.loadFromEnv({database})
    const secureSigningService = await SecureSigningServiceDsl.loadFromEnv("{{ENCRYPTION_SALT}}")
    const assetManagementService = await AssetManagementServiceDsl.loadFromEnv({ database, blockfrost, identityService, secureSigningService, blockchainService })
    const accountService = await AccountServiceDsl.loadFromEnv({ identityService, assetManagementService, blockchainService, governanceService,wellKnownPolicies })
    const idleQuestsService = await IdleQuestsServiceDsl.loadFromEnv({ randomSeed, calendar, database, evenstatsService, identityService, assetManagementService, metadataRegistry, questsRegistry, wellKnownPolicies })
    const kiliaBotService = await KiliaBotServiceDsl.loadFromEnv({ database, evenstatsService, identityService, governanceService, idleQuestsService })
    
    // Soon to be deprecated
    //await loadQuestModuleModels(database)
    const app = await buildApp( accountService, idleQuestsService, kiliaBotService)

    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}...`))
    revertStaledClaimsLoop(assetManagementService, new LoggingContext({ ctype: "params", component: "asset-management-service" }))
})()
