import { buildApp } from "./module-ddu-app/app"
import { PORT } from "./module-ddu-app/settings";
import { IdentityServiceDsl } from "./service-identity";
import { AssetManagementServiceDsl } from "./service-asset-management/service";
import { SecureSigningServiceDsl } from "./service-secure-signing";
import { connectToDB } from "./tools-database";
import { config } from "./tools-utils";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { loadQuestModuleModels } from "./module-quests/app/database/migration_scripts/migrate";
import { setTimeout } from "timers/promises";
import { LoggingContext } from "./tools-tracing";
import { AssetManagementService } from "./service-asset-management";
import { IdleQuestsServiceDsl } from "./service-idle-quests/service";
import dotenv from 'dotenv'

import Random from "./tools-utils/random";
import { loadQuestRegistry } from "./registry-quests";
import { loadWellKnownPoliciesFromEnv, wellKnownPoliciesMainnet } from "./registry-policies";
import { loadMetadataCache, loadMetadataLocationsFromEnv } from "./registry-metadata";

async function revertStaledClaimsLoop(assetManagementService: AssetManagementService, logger: LoggingContext) {
    await setTimeout(1000 * 60)
    const amountReverted = await assetManagementService.revertStaledClaims(logger)
    logger.info(`Reverted ${amountReverted} staled claims`)
    await revertStaledClaimsLoop(assetManagementService, logger)
}

(async () => {
    dotenv.config()
    const random = new Random(config.stringOrElse("RANDOM_SEED", Date.now().toString()))
    const metadataRegistry = await loadMetadataCache(loadMetadataLocationsFromEnv())
    const wellKnownPolicies = process.env.CARDANO_NETWORK === "mainnet" ? wellKnownPoliciesMainnet : loadWellKnownPoliciesFromEnv()
    const questsRegistry = await loadQuestRegistry(config.stringOrElse("QUEST_REGISTRY_LOCATION", "https://cdn.ddu.gg/quests/quest-registry.json"))
    const blockfrost = new BlockFrostAPI({ projectId: config.stringOrError("BLOCKFROST_API_KEY") })    
    const database = connectToDB({ 
        host: config.stringOrError("DB_HOST"),
        port: config.intOrError("DB_PORT"),
        sslCertPath: config.stringOrUndefined("DB_SSL_CERT_PATH"),
        username: config.stringOrError("DB_USERNAME"),
        password: config.stringOrError("DB_PASSWORD"),
        database: config.stringOrError("DB_DATABASE"),
    })
    const identityService = await IdentityServiceDsl.loadFromEnv({ database })
    const secureSigningService = await SecureSigningServiceDsl.loadFromEnv("{{ENCRYPTION_SALT}}")
    const assetManagementService = await AssetManagementServiceDsl.loadFromEnv({ database, blockfrost, identityService, secureSigningService })
    const idleQuestsService = await IdleQuestsServiceDsl.loadFromEnv({ random, database, assetManagementService, metadataRegistry, questsRegistry, wellKnownPolicies })
    
    // Soon to be deprecated
    await loadQuestModuleModels(database)
    const app = await buildApp(identityService, assetManagementService, idleQuestsService, wellKnownPolicies, database)

    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
    revertStaledClaimsLoop(assetManagementService, new LoggingContext({ ctype: "params", component: "asset-management-service" }))
})()
