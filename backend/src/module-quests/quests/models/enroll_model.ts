import { DataTypes, Model, Sequelize } from "sequelize"
import { Adventurer, IAdventurer } from "../../adventurers/models/adventurer_model.js"
import { TakenQuest } from "./taken_quest_model.js"

type IEnroll = {
    taken_quest_id: string,
    adventurer_id: string,
    adventurer?: IAdventurer
}

class Enrolled extends Model implements IEnroll {
    declare taken_quest_id: string;
    declare adventurer_id: string;
}

export const loadEnrolledModel = (sequelize: Sequelize) => {
    Enrolled.init({
        taken_quest_id: {
            type: DataTypes.UUID,
            references: {
                model: TakenQuest,
                key: 'id'
            }
        },
        adventurer_id: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            references: {
                model: Adventurer,
                key: "id"
            }
        }
    }, {
        sequelize,
        modelName: "enroll",
        tableName: "enrolls",
        timestamps: false
    })
}

export {
    Enrolled,
    IEnroll
}