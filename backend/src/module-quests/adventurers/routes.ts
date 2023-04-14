import {Router} from "express"
import { 
    syncCardanoWallet,
    getAllAdventurers,
} from "./controller.js";
import { getAdvofThioldenMetadata } from "../app/metadata/metadata.js"
import { Sequelize } from "sequelize";
import { AssetManagementService } from "../../service-asset-management.js";
import { IdleQuestsService } from "../../service-idle-quests.js";
import { WellKnownPolicies } from "../../registry-policies.js";


export const loadAdventurerRoutes = async (database: Sequelize, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService, wellKnownPolicies: WellKnownPolicies) => {
    const router = Router();
    const thioldenMetadata = await getAdvofThioldenMetadata()
    router.get('/adventurers', /*[syncCardanoWallet(database, assetManagementService, wellKnownPolicies, thioldenMetadata),*/ getAllAdventurers(thioldenMetadata, idleQuestsService))
    return router
}