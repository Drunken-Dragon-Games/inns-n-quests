import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
// import { sequelize } from '../../app/database/database'
import { calculateDeathCooldown } from "../utils";
import { getLevelFromXp } from "../utils";
import { calculateExperienceGained } from "../../quests/utils"

interface IAdventurerRes extends IAdventurer {
    name?: string,
    sprites?: string
}

interface IAdventurerMetadata {
    is_alive?: boolean,
    dead_cooldown?: number
}

interface IAdventurerData {
    id?: string,
    on_chain_ref: string,
    experience?: number,
    in_quest?: Boolean,
    type: string,
    user_id: string,
    metadata: IAdventurerMetadata,
    class: string,
    race: string,
}

interface IAdventurer extends IAdventurerData{
    getLevel(): number,
    addXP(amount: number, transaction: Transaction): Promise<number>,
    kill(): Promise<IDeadAdventurerData>,
    revive(): Promise<IAdventurerMetadata | void>,
    calculateGainedXP(questDifficulty: number): number
    changeInQuest(status: boolean, transaction?: Transaction): Promise<void>
    // Method to get adventurers from the db
    // Method that adds the sprites to the adventurers data
    // Method to revive list of gmas on request
}

interface IDeadAdventurerData {
    id: string,
    type: string,
    dead_cooldown?: number 
}

class Adventurer extends Model implements IAdventurer {
    declare id: string;
    declare on_chain_ref: string;
    declare experience: number;
    declare in_quest: Boolean;
    declare type: string;
    declare user_id: string;
    declare metadata: IAdventurerMetadata;
    declare class: string;
    declare race: string;

    /** CONVERTS EXPERIENCE TO LEVEL
    * @returns 
    */
    getLevel(): number {
        return getLevelFromXp(this.experience);
    }

    /** ADDS EXPERIENCE TO THIS ADVENTURER
    * @param amount
    * @returns 
    */
    async addXP(amount: number, transaction?: Transaction): Promise<number> {
        await this.update({ experience: this.experience + amount }, { transaction: transaction })
        return this.experience
    }

    /** KILLS THIS ADVENTURER AND RETURNS THE EXPECTED METADATA
    * DEPENDING ON THE ADVENTURER TYPE 
    * @returns 
    */
    async kill(): Promise<IDeadAdventurerData> {
        let deadAdventurerData: IDeadAdventurerData;
        let metadata: IAdventurerMetadata = {}
        if (this.type == "gma") {
            metadata = { 
                is_alive: false, 
                dead_cooldown: calculateDeathCooldown(this.experience) 
            }
            await this.update(
                { 
                    in_quest: false, 
                    metadata: metadata
                }
            )
            deadAdventurerData = {
                id: this.id,
                type: this.type,
                dead_cooldown: metadata.dead_cooldown
            }
        }
        else if (this.type == "pixeltile" || this.type == "aot"){
            await this.update({ 
                in_quest: false,
                experience: 0
             })
            deadAdventurerData = {
                id: this.id,
                type: this.type
            }
        } 
        return deadAdventurerData!
    }

    /** REVIVES THIS ADVENTURER AND RETURNS THE EXPECTED METADATA
    * @returns 
    */
    async revive(): Promise<IAdventurerMetadata | void> {
        if (this.type == "gma") {
            await this.update(
                { 
                    in_quest: false, 
                    metadata: { 
                        is_alive: true, 
                        dead_cooldown: 0
                    }
                }
            )
            return this.metadata
        }
        else {
            return
        } 
    }

    calculateGainedXP(questDifficulty: number): number {
        return calculateExperienceGained(this.getLevel(), questDifficulty);
    }

    async changeInQuest(status: boolean, transaction: Transaction): Promise<void> {
        await this.update({ in_quest: status }, { transaction: transaction })
    }
}

export const loadAdventurerModel = (sequelize: Sequelize) => {
    Adventurer.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        on_chain_ref: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        in_quest: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        class: {
            type: DataTypes.STRING,
            allowNull: false
        },
        race: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "adventurer",
        tableName: "adventurers",
        timestamps: false,
    })
}

export {
    Adventurer,
    IAdventurer,
    IAdventurerMetadata,
    IDeadAdventurerData,
    IAdventurerData,
    IAdventurerRes
};