import { Router } from "express"
import { acceptQuest, getTakenQuest, claimQuestReward, getRandomQuestsV2 } from "./controller.js"
import { checkTransactionLimit, checkAddressAvailability } from "../players/vending_machine.js"
import { Sequelize } from "sequelize"
import { AssetManagementService } from "../../service-asset-management/index.js"
import { IdleQuestsService } from "../../service-idle-quests/index.js"

import { Request } from "express-jwt"
import { NextFunction, Response } from "express"

export const idleQuestsRoutes = (database: Sequelize, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService) => {
    const router = Router();    

    return router
}