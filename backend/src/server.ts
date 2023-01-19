import { buildApp } from "./module-ddu-app/app"
import registry from "./module-ddu-app/assets/registry";
import { PORT } from "./module-ddu-app/settings";
import { IdentityServiceDsl } from "./service-identity";
import { AssetManagementServiceDsl } from "./service-asset-management/service";
import { SecureSigningServiceDsl } from "./service-secure-signing";
import { connectToDB } from "./tools-database";
import { config } from "./tools-utils";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { loadQuestModuleModels } from "./module-quests/app/database/migration_scripts/migrate";

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
    await registry.load(assetManagementService)
    await loadQuestModuleModels(database)
    const app = await buildApp(identityService, assetManagementService, database)

    await identityService.loadDatabaseModels()
    await assetManagementService.loadDatabaseModels()
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
})()
