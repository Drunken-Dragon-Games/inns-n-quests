import { Router } from "express"
import { acceptQuest, getTakenQuest, claimQuestReward, getRandomQuestsV2 } from "./controller"
import { checkTransactionLimit, checkAddressAvailability } from "../players/vending_machine"
import { Sequelize } from "sequelize"
import { AssetManagementService } from "../../service-asset-management"
import { IdleQuestsService } from "../../service-idle-quests"

import { Request } from "express-jwt"
import { NextFunction, Response } from "express"

export const idleQuestsRoutes = (database: Sequelize, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService) => {
    const router = Router();    

    return router
}