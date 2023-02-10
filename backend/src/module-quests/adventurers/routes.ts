import {Router} from "express"
import { 
    syncCardanoWallet,
    getAllAdventurers,
} from "./controller";
import { getAdvofThioldenMetadata } from "../app/metadata/metadata"
import { Sequelize } from "sequelize";
import { AssetManagementService } from "../../service-asset-management";
import { IdleQuestsService } from "../../service-idle-quests";
import { WellKnownPolicies } from "../../registry-policies";


export const loadAdventurerRoutes = async (database: Sequelize, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService, wellKnownPolicies: WellKnownPolicies) => {
    const router = Router();
    const thioldenMetadata = await getAdvofThioldenMetadata()
    router.get('/adventurers', [syncCardanoWallet(database, assetManagementService, wellKnownPolicies, thioldenMetadata), getAllAdventurers(thioldenMetadata, idleQuestsService)])
    return router
}