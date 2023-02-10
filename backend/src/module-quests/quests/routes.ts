import { Router } from "express";
import { acceptQuest, getTakenQuest, claimQuestReward, getRandomQuestsV2 } from "./controller";
import { checkTransactionLimit, checkAddressAvailability } from "../players/vending_machine";
import { Sequelize } from "sequelize";
import { AssetManagementService } from "../../service-asset-management";
import { IdleQuestsService } from "../../service-idle-quests";

export const loadQuestRoutes = (database: Sequelize, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService) => {
    const router = Router();    
    router.get('/quests', getRandomQuestsV2(database, idleQuestsService));
    router.post('/accept', acceptQuest(database, idleQuestsService));
    router.get('/taken-quests', getTakenQuest(idleQuestsService))
    router.post('/claim', [checkAddressAvailability, checkTransactionLimit, claimQuestReward(database, assetManagementService, idleQuestsService)]);
    return router
}