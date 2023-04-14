import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import dotenv from 'dotenv'
import { setTimeout } from "timers/promises"
import { buildApp } from "./module-ddu-app/app.js"
import { PORT } from "./module-ddu-app/settings.js"
import { AssetManagementService } from "./service-asset-management/index.js"
import { AssetManagementServiceDsl } from "./service-asset-management/service.js"
import { IdentityServiceDsl } from "./service-identity/index.js"
import { IdleQuestsServiceDsl } from "./service-idle-quests/service.js"
import { SecureSigningServiceDsl } from "./service-secure-signing/index.js"
import { connectToDB } from "./tools-database/index.js"
import { LoggingContext } from "./tools-tracing/index.js"
import { config } from "./tools-utils/index.js"

import path from "path"
import { loadMetadataCache, loadMetadataLocationsFromEnv } from "./registry-metadata.js"
import { loadWellKnownPoliciesFromEnv, wellKnownPoliciesMainnet } from "./registry-policies.js"
import { loadQuestRegistry } from "./service-idle-quests/state/staking-quests-registry.js"
import { EvenstatsServiceDsl } from "./service-evenstats/service.js"
import { KiliaBotServiceDsl } from "./service-kilia-bot/index.js"
import { commonCalendar } from "./tools-utils/calendar.js"
import { AccountServiceDsl } from "./service-account/index.js"
import { Blockfrost, Lucid } from "lucid-cardano"
import { cardanoNetworkFromString } from "./tools-cardano/index.js"
import { fileURLToPath } from "url"

async function revertStaledClaimsLoop(assetManagementService: AssetManagementService, logger: LoggingContext) {
    await setTimeout(1000 * 60)
    const amountReverted = await assetManagementService.revertStaledClaims(logger)
    logger.info(`Reverted ${amountReverted} staled claims`)
    await revertStaledClaimsLoop(assetManagementService, logger)
}

(async () => {
    console.log("Starting DDU backend")
    dotenv.config()
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const randomSeed = config.stringOrElse("RANDOM_SEED", Date.now().toString())
    const calendar = commonCalendar
    const metadataRegistry = await loadMetadataCache(loadMetadataLocationsFromEnv())
    const wellKnownPolicies = process.env.CARDANO_NETWORK === "mainnet" ? wellKnownPoliciesMainnet : loadWellKnownPoliciesFromEnv()
    const questsRegistry = await loadQuestRegistry(
        config.stringOrElse("QUEST_REGISTRY_LOCATION", path.join(__dirname, "..", "stubs", "test-quest-registry.yaml")), 
        config.typeOrElse("QUEST_REGISTRY_FORMAT", "yaml", (obj: any): obj is "yaml" | "json" => obj === "yaml" || obj === "json"), 
    )
    const network = cardanoNetworkFromString(config.stringOrElse("CARDANO_NETWORK", "Preprod"))
    const blockfrostApiKey = config.stringOrError("BLOCKFROST_API_KEY")
    const blockfrost = new BlockFrostAPI({ projectId: blockfrostApiKey })    
    const lucid = await Lucid.new(new Blockfrost(blockfrost.apiUrl, blockfrostApiKey), network)
    const database = connectToDB({ 
        host: config.stringOrError("DB_HOST"),
        port: config.intOrError("DB_PORT"),
        sslCertPath: config.stringOrUndefined("DB_SSL_CERT_PATH"),
        username: config.stringOrError("DB_USERNAME"),
        password: config.stringOrError("DB_PASSWORD"),
        database: config.stringOrError("DB_DATABASE"),
    })
    const evenstatsService = await EvenstatsServiceDsl.loadFromEnv({ database })
    const identityService = await IdentityServiceDsl.loadFromEnv({ database })
    const secureSigningService = await SecureSigningServiceDsl.loadFromEnv("{{ENCRYPTION_SALT}}")
    const assetManagementService = await AssetManagementServiceDsl.loadFromEnv({ database, blockfrost, identityService, secureSigningService, lucid })
    const accountService = await AccountServiceDsl.loadFromEnv({ identityService, assetManagementService, wellKnownPolicies })
    const idleQuestsService = await IdleQuestsServiceDsl.loadFromEnv({ randomSeed, calendar, database, evenstatsService, assetManagementService, metadataRegistry, questsRegistry, wellKnownPolicies })
    const kiliaBotService = await KiliaBotServiceDsl.loadFromEnv({ database, evenstatsService, identityService })
    
    // Soon to be deprecated
    //await loadQuestModuleModels(database)
    const app = await buildApp(identityService, assetManagementService, accountService, idleQuestsService, wellKnownPolicies)

    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
    revertStaledClaimsLoop(assetManagementService, new LoggingContext({ ctype: "params", component: "asset-management-service" }))
})()
