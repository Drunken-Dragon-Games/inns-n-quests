import { NextFunction, Response } from "express";
import sequelize, { Sequelize } from "sequelize"
import { Request } from "express-jwt";
// import { sequelize } from "../app/database/database";
import { IFilteredAdventurers } from "../app/types";
import { Model } from "sequelize/types";
import { handleQuestsByAdventurerLevel } from "./utils";
import { shuffle } from "../app/utils";
import ApiError from "../app/error/api_error";
import { Adventurer,
         IAdventurer } from "../adventurers/models"
import { Enrolled, 
         Quest,
         IQuest,
         IQuestCreation,
         TakenQuest } from "./models";
import { withTracing } from "../base-logger";
import { AssetManagementService } from "../../service-asset-management";

const { Op } = require("sequelize");

////////////////// GETS RANDOM QUESTS  ////////////////////
/* 
GETS PLAYER ADVENTURERS
QUERIES RANDOM QUESTS FROM THE DB BASED ON ADVENTURER LEVEL BUCKETS
RETURN QUESTS TO THE CLIENT
*/
const getRandomQuestsV2 = (sequelize: Sequelize) => async (request: Request, response: Response, next: NextFunction) => {
    const userId = request.auth!.userId
    const numberOfQuests = 20;

    try {
        // GETS THE MAX AND MIN LEVEL OF THE PLAYER ADVENTURERS
        let xpMin: number = await Adventurer.min('experience', { where: { 
            user_id: userId, 
            in_quest: false,
            [Op.or]: [{ type: "pixeltile" }, {type: "gma", metadata: { is_alive: true }}]
        }});
        let xpMax: number = await Adventurer.max('experience', { where: { 
            user_id: userId, 
            in_quest: false,
            [Op.or]: [{ type: "pixeltile" }, {type: "gma", metadata: { is_alive: true }}]
        }});
        
        // CREATES THE NUMBER OF ADVENTURER BUCKETS TO FILTER QUESTS
        let adventurerFilters: IFilteredAdventurers[] = handleQuestsByAdventurerLevel(xpMin, xpMax);
        
        let adventurers: Adventurer[] = await Adventurer.findAll({
            where: {
                user_id: userId,
                in_quest: false,
                [Op.or]: [{ type: "pixeltile" }, {type: "gma", metadata: { is_alive: true }}]
            }
        });
        
        // FILLS UP THE BUCKET WITH ADVENTURER DATA
        adventurers.forEach((adventurer: Adventurer) => {
            
            adventurerFilters.forEach(group => {
                const filter = group;
                if (filter.min_level <= adventurer.getLevel() &&
                filter.max_level >= adventurer.getLevel()
                ) {
                    filter.adventurer_count++;
                    const currentNumberOfAdventurers = filter.adventurer_count;
                    const averageLevel = filter.average_level;
                    filter.average_level = ((averageLevel * (currentNumberOfAdventurers - 1)) + adventurer.getLevel())/ currentNumberOfAdventurers;
                }
            })
        });
        
        let totalNumberOfAdventurers: number = adventurers.length;
        let queryArray: Promise<Model<IQuest, IQuestCreation>[]>[] = [];
        // GETS QUESTS BASED ON BUCKET DATA
        if (totalNumberOfAdventurers <= 0) {
            queryArray.push(
                Quest.findAll({ 
                    order: [ sequelize.fn('RANDOM') ], 
                    limit: 20, 
                    where: { difficulty: { [Op.between]: [1, 4] }, is_war_effort: false } 
                })
            )
        }
        else if(totalNumberOfAdventurers > 0){
            let count: number = 5;
            adventurerFilters.forEach(group => {
                count--;
                const filter = group;
                if (filter.adventurer_count > 0) {
                    let questAmount: number = Math.round((filter.adventurer_count / totalNumberOfAdventurers)*numberOfQuests)
                    let lowDifficulty: number = filter.average_level - count;
                    let highDifficulty: number = filter.average_level + filter.difficulty_offset
                    
                    queryArray.push(Quest.findAll({ 
                        order: [ sequelize.fn('RANDOM') ], 
                        limit: questAmount, 
                        where: { difficulty: { [Op.between]: [lowDifficulty, highDifficulty] }, is_war_effort: false } 
                    }))
                }
            }) 
        }

        let warEffortQuests = Quest.getWarEffortQuests(userId, sequelize);

        queryArray = queryArray.concat(warEffortQuests);

        let quests = await Promise.all(queryArray).then(data => {
            return [].concat.apply([], data as any)
        });

        return response.status(200).send(shuffle(quests));
        
    } catch (error: any) { 
        next(error);
    }
}


////////////////// ACCEPTS A QUEST ////////////////////
/* 
RECEIVES QUEST ID
CREATED ENROLLMENT AND TAKEN QUEST TO DB
CHANGES ADVENTURER STATUS
*/
const acceptQuest = (database: Sequelize) => async (request: Request, response: Response, next: NextFunction) => {
    const questId: string = request.body.quest_id;
    const adventurerIds: string[] = request.body.adventurer_ids;
    const userId: string = request.auth!.userId
    
    // GETS ADVENTURERS AND CHECKS IF THEY ARE AVAILABLE, IF NOT STATUS 400
    let adventurers: Model<IAdventurer>[];

    try {
        // REQUEST BODY CHECK
        if (adventurerIds == undefined) throw new ApiError(400, "invalid_adventurers", "invalid_adventurers")
        else if(adventurerIds.length == 0) throw new ApiError(400, "not_enough_adventurers", "Not enough adventurers")
        else if(!questId) throw new ApiError(400, "quest_not_provided", "Quest not provided")

        // QUEST QUERY AND ERROR HANDLING
        let quest: Quest | null = await Quest.findOne({
            where: {
                id: questId
            }
        });
        
        if(!quest) throw new ApiError(404, "quest_not_found", "Quest not found")
        else if(adventurerIds.length > quest.getDataValue("slots")) throw new ApiError(400, "too_many_adventurers", "There are too many adventurers")

        // ADVENTURER QUERY AND ERROR HANDLING
        adventurers = await Adventurer.findAll({
            where: {
                id: adventurerIds
            }
        });

        adventurers.forEach(adventurer => {
            if (adventurer.getDataValue("type") == "gma" && !adventurer.getDataValue("metadata").is_alive) {
                throw new ApiError(400, "adventurer_not_available", "Not every adventurer is available")
            }
        })

        if (!adventurers.every(adventurer => { return !adventurer.getDataValue("in_quest")})) throw new ApiError(400, "adventurer_not_available", "Not every adventurer is available")

        /*
            TRANSACTION THAT:
             - CREATES TAKEN QUEST
             - CREATES QUEST ENROLLMENT
             - SETS ADVENTURERS TO IN QUEST
            OTHERWISE DB ROLLBACK
        */
        const takenQuest = await quest.accept(userId, adventurerIds, database)
            
        return response.status(201).send(takenQuest)
    } catch (error: any) {
        next(error)
    }
}

////////////////// GETS TAKEN QUESTS  ////////////////////
/* 
GETS PLAYER TAKEN QUESTS
CHECKS THE STATUS OF THE TAKEN QUEST
CHANGES STATUS IF NEEDED
*/
const getTakenQuest = async (request: Request, response: Response, next: NextFunction) => {
    const userId: string = request.auth!.userId

    try {
    // GETS TAKEN QUESTS FROM PLAYER
    const takenQuests: TakenQuest[] = await TakenQuest.findAll({
        where: {
            user_id: userId,
            is_claimed: false
        },
        include: [{
            model: Quest
        }, {
            model: Enrolled,
            include: [{
                model: Adventurer
            }],
        }]
    });
    
    // CHECKS STATUS THE STATUS OF EACH TAKEN QUEST
    let takenQuestsJSON: TakenQuest[] = new Array();
    for (let i = 0; i < takenQuests.length; i++) {
        if (Date.parse(takenQuests[i].started_on as string) + takenQuests[i].quest!.duration < Date.now()
            && takenQuests[i].state == "in_progress"
        ) {
            await takenQuests[i].calculateQuestOutcome();
        }
        takenQuestsJSON.push(takenQuests[i].toJSON());
    }
    
    // const takenQuestsJSON: TakenQuest[] = takenQuests.map((takenQuest: TakenQuest) => {
        
    //      if (Date.parse(takenQuest.started_on as string) + takenQuest.quest!.duration < Date.now()
    //         && takenQuest.state == "in_progress"         
    //      ) {
    //         takenQuest.calculateQuestOutcome()
    //      }
    //      return takenQuest.toJSON()
    // })

    return response.status(200).json(takenQuestsJSON)   
    } catch (error: any) {
        next(error);
    }
}

////////////////// CLAIMS QUEST REWARDS  ////////////////////
/* 
GETS SPECIFIC TAKEN QUEST FROM PLAYER
UPDATES DB: DELETES ENROLLMENTS, CHANGES TAKEN QUEST STATUS, CHANGES ADVENTURER STATUS
DISTRIBUTES REWARDS
*/
const claimQuestReward = (sequelize: Sequelize, assetManagementService: AssetManagementService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    // const stakeAddress: string  = request.auth!.stake_address!
    const userId: string = request.auth!.userId
    const takenQuestId: string = request.body.taken_quest_id;
    let quest_status = false;
    let data = new Array;

    try {
        // REQUEST BODY CHECK
        if (!takenQuestId) throw new ApiError(400, "id_missing", "Taken Quest Id was not given")

        // DB QUERIES
        const takenQuest: TakenQuest | null = await TakenQuest.findOne({
            include: [{
                model: Quest
            }, {
                model: Enrolled,
                include: [{
                    model: Adventurer
                }]
            }],
            where: {
                id: takenQuestId,
                user_id: userId
            }
        });

        if(!takenQuest) throw new ApiError(404, "quest_not_found", "Quest not found")
        else if(takenQuest.getDataValue("state") == "in_progress") throw new ApiError(400, "quest_not_finished", "Quest has not finished yet")
        else if(takenQuest.getDataValue("is_claimed")) throw new ApiError(400, "quest_already_claimed", "Quest already claimed")

        // VARIABLE SETUP
        // let takenQuestJSON: ITakenQuest = takenQuest?.toJSON();
        let dragonSilver = takenQuest.quest.reward_ds;
        // UPDATE DB TRANSACTION
        if(takenQuest.state == "failed") {
            // IF QUEST FAILS CHECKS EACH ADVENTURER ALIVE STATUS
            data = await takenQuest.fail(sequelize)
        } else {
            // CHECKS IF THERE HAS BEEN MANY ATTEMPTS TO CLAIM
            // if (!checkTxAddressStatus(dragonSilver, stakeAddress)) {
            //     logger.log.warn(`ATTEMPT TO CLAIM TOO MANY REWARDS BY ADDRESS ${stakeAddress}`);
            //     throw new ApiError(409, "tx_limit_exceeded", "Transaction limit exceded")
            // }
            
            data = await takenQuest.claim(sequelize, assetManagementService, logger);
            quest_status = true;
        }
        if(quest_status){
            return response.status(200).json({ adventurers: data });
        }
        return response.status(200).json({ "dead_adventurers": data });
    } catch (error: any) {
        next(error);
    }
}

export {
    acceptQuest,
    getTakenQuest,
    claimQuestReward,
    getRandomQuestsV2
}