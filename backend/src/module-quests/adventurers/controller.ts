import { Adventurer, IAdventurer, IAdventurerMetadata} from "./models"
import SyncAssets from "./sync_assets";
import { NextFunction, Response} from "express"
import { Request } from "express-jwt";
import { IAdventurerRes } from "../adventurers/models/adventurer_model";
import { AuthRequest } from "../app/types";
import { Model, Sequelize } from "sequelize/types";
import { getAdventurerToReturn } from "./app-logic/get-adventurer-sprite";
import { withTracing } from "../base-logger";
import { AssetManagementService } from "../../service-asset-management";
import { IdleQuestsService } from "../../service-idle-quests";
import { WellKnownPolicies } from "../../registry-policies";

///////////////////// ASSET SYNCHRONIZATION  //////////////////////////
/*
VIEW MIDDLEWARE THAT HANDLES CARDANO WALLET TO ACCOUNT SYNCHRONIZATION

GETS THE ADVENTURERS IN THE DATABASE AND COMPARES IT 
TO THE ADVENTURER NFT IN CARANO WALLET

THE FUNCTION USES A SYNCASSETS CLASS TO PERFORM SYNCHRONIZATION

*/
const syncCardanoWallet =  (database: Sequelize, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies, thioldenMetadata: any) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const userId = request.auth!.userId
    let assets = new SyncAssets(userId, thioldenMetadata, wellKnownPolicies, logger);
    try {
        await assets.init(assetManagementService, logger);
        await assets.sync(database, logger);
    } catch (error: any) {
        next(error)
    }
    
    next();
}

////////////////////////// GET ADVENTURERS ///////////////////////
/*

VIEW THAT QUERIES ALL THE ADVENTURERS FROM THE DB
ADDS THE CORRESPONDING SPRITE AND RETURNS INSTANCES

*/
const getAllAdventurers = (thioldenMetadata: any, idleQuestsService: IdleQuestsService) => async (request: Request, response: Response, next: NextFunction) => {
    const userId: string  = (request as AuthRequest).auth.userId!
    const logger = withTracing(request)
    /*
    try {   
        // QUERY TO THE DB
        logger.log.info({message: "trying to get all adventurers"})
        let adventurers: Model<IAdventurer>[] = await Adventurer.findAll({ 
            attributes: [ "id", "on_chain_ref", "experience", "in_quest", "type", "metadata", "race", "class" ],
            where: { 
                user_id: userId 
            }
        });
        //logger.log.info({message: "get all adventurers got", adventurers})
        let gmAdventurers: Model<IAdventurer>[] = adventurers.filter((adventurer: Model<IAdventurer>) => {
            return adventurer.toJSON().type == "gma"
        })

    gmAdventurers.forEach((adventurer: Model<IAdventurer>) => {
        let adventurerMetadata: IAdventurerMetadata = adventurer.toJSON().metadata;
        if (!adventurerMetadata.is_alive && adventurerMetadata.dead_cooldown! < Date.now()) {
            adventurer.update({metadata: { is_alive: true, dead_cooldown: 0}});
        }
    })

    // CONVERTS DATA TO JSON
    let adventurersJSON = adventurers.map(adventurer => { return adventurer.toJSON() })

    // ADDS EACH ADVENTURER SPRITES TO THE RESPONSE DATA
    adventurersJSON.map((adventurer: IAdventurerRes) => {
        return getAdventurerToReturn(adventurer, thioldenMetadata)
    });
    //logger.log.info({message: "adventurers JSON is", adventurersJSON})
    return response.status(200).json(adventurersJSON)
    } catch (error) {
        next(error)
    }
    */
    return response.status(200).json(await idleQuestsService.module_getAllAdventurers(userId))
}

export {
    getAllAdventurers,
    syncCardanoWallet,
}