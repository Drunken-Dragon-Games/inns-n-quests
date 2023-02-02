import { buildApp } from "./module-ddu-app/app"
import * as questUtils from "./module-quests/app/utils"
import assetsRegistry from "./module-ddu-app/assets/registry"
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

import metadataCache from "./service-idle-quests/items/metadata-cache";

async function revertStaledClaimsLoop(assetManagementService: AssetManagementService, logger: LoggingContext) {
    await setTimeout(1000 * 60)
    const amountReverted = await assetManagementService.revertStaledClaims(logger)
    logger.info(`Reverted ${amountReverted} staled claims`)
    await revertStaledClaimsLoop(assetManagementService, logger)
}

(async () => {
    const database = connectToDB({ 
        host: config.stringOrError("DB_HOST"),
        port: config.intOrError("DB_PORT"),
        sslCertPath: config.stringOrUndefined("DB_SSL_CERT_PATH"),
        username: config.stringOrError("DB_USERNAME"),
        password: config.stringOrError("DB_PASSWORD"),
        database: config.stringOrError("DB_DATABASE"),
    })
    const blockfrost = new BlockFrostAPI({ projectId: config.stringOrError("BLOCKFROST_API_KEY") })    
    const identityService = await IdentityServiceDsl.loadFromEnv({ database })
    const secureSigningService = await SecureSigningServiceDsl.loadFromEnv("{{ENCRYPTION_SALT}}")
    const assetManagementService = await AssetManagementServiceDsl.loadFromEnv({ database, blockfrost, identityService, secureSigningService })
    const idleQuestsService = await IdleQuestsServiceDsl.loadFromEnv({ database, assetManagementService })
    
    await metadataCache.load()
    await assetsRegistry.load(assetManagementService)
    await questUtils.registry.load(assetManagementService)
    await loadQuestModuleModels(database)
    const app = await buildApp(identityService, assetManagementService, idleQuestsService, database)

    await identityService.loadDatabaseModels()
    await assetManagementService.loadDatabaseModels()
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

    revertStaledClaimsLoop(assetManagementService, new LoggingContext({ ctype: "params", component: "asset-management-service" }))
})()
