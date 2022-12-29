import { Router } from "express";
import { acceptQuest, getTakenQuest, claimQuestReward, getRandomQuestsV2 } from "./controller";
import { checkTransactionLimit, checkAddressAvailability } from "../players/vending_machine";
import { Sequelize } from "sequelize";
import { AssetManagementService } from "../../service-asset-management";

export const loadQuestRoutes = (database: Sequelize, assetManagementService: AssetManagementService) => {
    const router = Router();    
    router.get('/quests', getRandomQuestsV2(database));
    router.post('/accept', acceptQuest(database));
    router.get('/taken-quests', getTakenQuest)
    router.post('/claim', [checkAddressAvailability, checkTransactionLimit, claimQuestReward(database, assetManagementService)]);
    return router
}