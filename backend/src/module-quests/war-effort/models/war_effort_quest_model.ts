import { DataTypes, Model, Sequelize } from "sequelize"
import { Quest } from "../../quests/models/quest_model.js"
import { WarEffortFaction } from "./war_effort_factions_model.js"
import { WarEffort } from "./war_effort_model.js"
import { Transaction } from "sequelize"

interface IWarEffortQuest {
    quest_id: string
    reward_wep: number
    faction_id: string
    war_effort_id: WarEffort
    quest?: Quest
    rewardFaction(transaction: Transaction): Promise<void>
    getFaction(): Promise<WarEffortFaction>
}

class WarEffortQuest extends Model implements IWarEffortQuest {
    declare quest_id: string;
    declare reward_wep: number;
    declare faction_id: string;
    declare war_effort_id: WarEffort;
    declare quest: Quest;

    async rewardFaction(transaction: Transaction): Promise<void> {
        const faction = await this.getFaction();
        await faction.addPoints(this.reward_wep, transaction)
    }

    async getFaction(): Promise<WarEffortFaction> {
        const faction = await WarEffortFaction.findOne({
            where: {
                id: this.faction_id
            }
        });
        return faction!
    }
}

export const loadWarEffortQuestModel = (sequelize: Sequelize) => {

    WarEffortQuest.init({
        quest_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: Quest,
                key: "id"
            }
        },
        reward_wep: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        faction_id: {
            type: DataTypes.UUID,
            references: {
                model: WarEffortFaction,
                key: "id"
            }
        },
        war_effort_id: {
            type: DataTypes.UUID,
            references: {
                model: WarEffort,
                key: "id"
            }
        }
    }, {
        sequelize,
        modelName: "war_effort_quest",
        tableName: "war_effort_quests",
        timestamps: false
    })
}

export {
    WarEffortQuest,
    IWarEffortQuest
}