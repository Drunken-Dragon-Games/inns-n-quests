import { NextFunction, Request, Response } from "express"
import { Sequelize, Transaction } from "sequelize"
import { Quest } from "../quests/models"
import { WarEffort, WarEffortFaction, WarEffortQuest } from "./models"

const createWarEffort = async (request: Request, response: Response) => {
    const { name, description, faction_names } = request.body
    const min = 10
    const duration = min * 60 * 1000
    const startingDate = Date.now()

    const warEffort = await WarEffort.create({
        name: name,
        description: description,
        started_on: startingDate,
        duration: duration
    })

    const factionQueries = faction_names.map((faction: string) => {
        return WarEffortFaction.create({
            name: faction,
            war_effort_id: warEffort.id
        })
    })

    const factions = await Promise.all(factionQueries)
    
    return response.status(201).send({
        message: "War Effort Created",
        code: "war_effort_created",
    })
}

const getActiveWarEfforts = async (request: Request, response: Response, next: NextFunction) => {
    const warEfforts = await WarEffort.findAll({
        where: {
            is_active: true
        },
        include: [{
            model: WarEffortFaction,
            attributes: ["id", "name", "points"]
        }]
    })
    return response.status(200).send(warEfforts)
}

const createWarEffortQuest = (database: Sequelize) => async (request: Request, response: Response, next: NextFunction) => {
    const { war_effort_id, 
            name, 
            description,
            difficulty,
            rarity, 
            reward_ds,
            duration, 
            reward_wep, 
            faction_id,
            slots } = request.body

    try {        
        const warEffortQuest = await database.transaction(async (t: Transaction) => {

            
            const quest = await Quest.create({
                name: name,
                description: description,
                reward_ds: reward_ds,
                reward_xp: 0,
                difficulty: difficulty,
                slots: slots,
                rarity: rarity,
                duration: duration,
                requirements: {},
                is_war_effort: true,
            }, {
                transaction: t
            })
            const warEffortQuest = await WarEffortQuest.create({
                quest_id: quest.id,
                reward_wep: reward_wep,
                war_effort_id: war_effort_id,
                faction_id: faction_id
            }, {
                transaction: t
            })
            return quest
        })
        return response.status(201).send(warEffortQuest)
    } catch (error: any) {
        console.log(error.message)
        
        next(error)
    }
}

export {
    createWarEffort,
    getActiveWarEfforts,
    createWarEffortQuest
}
