import {Router} from "express"
import { 
    syncCardanoWallet,
    getAllAdventurers,
} from "./controller";
import { getAdvofThioldenMetadata } from "../app/metadata/metadata"
import { Sequelize } from "sequelize";
import { AssetManagementService } from "../../service-asset-management";


export const loadAdventurerRoutes = async (database: Sequelize, assetManagementService: AssetManagementService) => {
    const router = Router();
    const thioldenMetadata = await getAdvofThioldenMetadata()
    router.get('/adventurers', [syncCardanoWallet(database, assetManagementService, thioldenMetadata), getAllAdventurers(thioldenMetadata)])
    return router
}