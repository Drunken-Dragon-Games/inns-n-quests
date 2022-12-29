import { DataTypes, Model, Optional, Sequelize } from "sequelize"
import ApiError from "../../app/error/api_error"
import { Adventurer } from "../../adventurers/models/adventurer_model"
import { IEnroll, Enrolled } from "./enroll_model"
import { ITakenQuest, TakenQuest } from "./taken_quest_model"
import { WarEffort } from "../../war-effort/models/war_effort_model"
import { WarEffortQuest } from "../../war-effort/models/war_effort_quest_model"

interface ICharacterRequirements {
    class?: string
    race?: string
    type?: string
}

interface IPartyRequirements {
    balanced: boolean
}

interface IQuestRequirements {
    character?: ICharacterRequirements[]
    party?: IPartyRequirements
    all?: boolean
}

interface IQuest {
    id?: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    requirements: IQuestRequirements
    is_war_effort: boolean
    accept(
        userId: string,
        adventurerIds: string[],
        sequelize: Sequelize
    ): Promise<ITakenQuest>
    validateRequirements(adventurers: Adventurer[]): Boolean[]
    validateCharacterAttributeRequirements(adventurers: Adventurer[]): Boolean[]
    validatePartyRequirements(adventurers: Adventurer[]): Boolean[]
    getWarEffortQuest(): Promise<WarEffortQuest>
}

type IQuestCreation = Optional<IQuest, 'id'>

class Quest extends Model implements IQuest {
    declare id: string
    declare name: string
    declare description: string
    declare reward_ds: number
    declare reward_xp: number
    declare difficulty: number
    declare slots: number
    declare rarity: string
    declare duration: number
    declare requirements: IQuestRequirements
    declare is_war_effort: boolean

    /** ACCEPTS THE QUEST CREATING A TAKENQUEST, ENROLLED AND UPDATING ADVENTURER INSTANCE
    * @param userId User Id to identify the player who accept the quest 
    * @param adventurerIds List of adventurer ids to update the intances to in_quest
    * @returns The taken quest data as a json
    */
    async accept(userId: string, adventurerIds: string[], sequelize: Sequelize): Promise<ITakenQuest> {
        if (await Quest.checkDailyWarEffort(userId) && this.is_war_effort) throw new ApiError(409, "war_effort_quest_already_taken", "You can not have more than one War Effort Quest in progress")

        const takenQuest: ITakenQuest = await sequelize.transaction(async t => {
            const takenQuestInstance: Model<ITakenQuest> = await TakenQuest.create({
                user_id: userId,
                quest_id: this.id
            }, { 
                transaction: t,
            });
        
            let enrollData: IEnroll[] = adventurerIds.map(id => {
                return {
                    taken_quest_id: takenQuestInstance.getDataValue("id")!,
                    adventurer_id: id
                }
            })
            await Enrolled.bulkCreate(enrollData, { transaction: t});
            await Adventurer.update({ in_quest: true }, {
                where: {
                    id: adventurerIds
                },
                transaction: t
            })
            return takenQuestInstance.toJSON()
        });
        let takenQuestData = await TakenQuest.findOne({
            where: {
                id: takenQuest.id
            },
            include: [{
                model: Quest
            }, {
                model: Enrolled,
                include: [{
                    model: Adventurer
                }],
            }]
        })
        return takenQuestData!
    }

    /** BEFORE CREATING A TAKEN QUEST THIS METHOD CHECKS WHETHER ALL REQUIREMENTS ARE FULLFILLED
    * @param adventurerIds List of adventurer ids to pass to other validators
    * @returns True of false depending on the requirements being fullfilled or not
    */
    validateRequirements(adventurers: Adventurer[]): Boolean[] {
        let requirements = new Array()
        requirements = requirements.concat(this.validateCharacterAttributeRequirements(adventurers));
        requirements = requirements.concat(this.validatePartyRequirements(adventurers));
        return requirements;
    }

    /** Character Attribute Requirement Validator
    * @param adventurers List of adventurer instances to check adventurer attribute requirement (e.g. class, race, etc)
    * @returns True of false depending on the requirement being fullfilled or not
    */
    validateCharacterAttributeRequirements(adventurers: Adventurer[]): Boolean[] {
        if(this.requirements.character == undefined) return []
        let areFullfilled: Boolean[] = this.requirements.character.map(requirement => {
            /* If the all option is set to false or is undefined it will just look 
            * for one adventurer that fullfills the requirement
            */
            if (this.requirements.all == undefined || this.requirements.all == false) {                
                let adventurerOfClass = adventurers.find(adventurer => {
                    let have_attributes = Object.keys(requirement).map(attribute => adventurer[attribute as keyof Adventurer] == requirement[attribute as keyof ICharacterRequirements]);
                    return have_attributes.every(isFullfilled => isFullfilled)
                })
                if(adventurerOfClass != undefined) return true
                return false
                /* If the all option is set to true it will compare all the adventurers
                * with the requirement
                */
            } else {               
                let all = adventurers.every(adventurer => {
                    let have_attributes = Object.keys(requirement).map(attribute => adventurer[attribute as keyof Adventurer] == requirement[attribute as keyof ICharacterRequirements]);     
                    return have_attributes.every(isFullfilled => isFullfilled)
                });
                return all;
            }
        })
        // return areFullfilled.every(isFullfilled => isFullfilled);
        return areFullfilled
    }

    /** Party Requirement Validator
    * @param adventurers List of adventurer instances to compare its classes
    * @returns True of false depending on the requirement being fullfilled or not
    */
    validatePartyRequirements(adventurers: Adventurer[]): Boolean[] {
        if (this.requirements.party == undefined) return []

        let partyClasses = new Set();
        if (this.requirements.party.balanced) {
            adventurers.forEach(adventurer => {
                partyClasses.add(adventurer.class)
            });
        }
        return [partyClasses.size == adventurers.length];
    }

    /** Method that gets the War Effort Quest instance
     * @returns Amount of War Effort Points 
     */
    async getWarEffortQuest(): Promise<WarEffortQuest> {
        if(!this.is_war_effort) throw new Error("This quest is not a War Effort Quest")
        let warEffortQuest = await WarEffortQuest.findOne({
            where: {
                quest_id: this.id
            }
        })

        return warEffortQuest!;
    }


    /** Method that returns War Effort Quest to send it to the client
     * @returns Two War Effort Quests
     */
    static async getWarEffortQuests(userId: string, sequelize: Sequelize): Promise<Quest[]> {
        const warEffort: WarEffort | null = await WarEffort.findOne({
            where: {
                is_active: true
            }
        });
        
        if (warEffort == null) return []
        if (!warEffort.isActive()) return []
        if (await Quest.checkDailyWarEffort(userId)) return []
        

        const warEffortQuests: WarEffortQuest[] | null = await sequelize.query('select distinct on ("faction") * from \
        (select quests.id as id, quests.name as name, "description", war_effort_factions.name as faction, "reward_xp", \
        "reward_ds", "reward_wep", "difficulty", "slots", "rarity", "duration", "requirements", "is_war_effort" from \
        war_effort_quests full outer join quests on quests.id=war_effort_quests.quest_id full outer join war_effort_factions \
        on war_effort_factions.id=war_effort_quests.faction_id where war_effort_quests.war_effort_id=(select id from war_efforts \
        where is_active=true) order by random()) as weq;', {
            model: WarEffortQuest
        })
        
        return warEffortQuests as any[]
    }

    /** Method that checks if a player has an 'in_progress' War Effort Taken Quest
    * @param userId String to reference player
    * @returns True if the player has an 'in_progress' War Effort Taken Quest, False otherwise
    */
    static async checkDailyWarEffort(userId: string): Promise<Boolean> {
        const warEffortQuest = await TakenQuest.findOne({
            where: {
                user_id: userId,
                state: "in_progress"
            },
            include: [{
                model: Quest,
                where: {
                    is_war_effort: true,
                }
            }]
        })
        
        return warEffortQuest != null
    }
}

export const loadQuestModel = (sequelize: Sequelize) => {
    Quest.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        reward_ds: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reward_xp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        slots: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rarity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        requirements: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        is_war_effort: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: "quest",
        tableName: "quests",
        timestamps: false
    })
}

export {
    Quest,
    IQuest,
    IQuestCreation,
    IQuestRequirements,
    ICharacterRequirements
}