import { DataTypes, Model, Optional, Sequelize, Transaction } from "sequelize";
import { WarEffort } from './war_effort_model'

interface IWarEffortFaction {
    name: string
    points: number
    war_effort_id: string
    addPoints(amount: number, transaction: Transaction): Promise<void>
    getWarEffort(): Promise<WarEffort>
}

class WarEffortFaction extends Model implements IWarEffortFaction {
    declare name: string;
    declare points: number;
    declare war_effort_id: string;

    /** Adds War Effort reward amount to the faction points
     * If the War Effort is not active, this will do nothing
     * @param amount Amount of points to be added
     * @returns Nothing
     */
    async addPoints(amount: number, transaction: Transaction): Promise<void> {
        const warEffort = await this.getWarEffort();
        if (await warEffort.isActive()) {            
            await this.update({ points: this.points + amount }, { transaction: transaction });
        }
    }

    /** Gets the War Effort associated to this Faction
     * @returns War Effort Instance
     */
    async getWarEffort(): Promise<WarEffort> {
        const warEffort = await WarEffort.findOne({
            where: {
                id: this.war_effort_id
            }
        });
        return warEffort!
    }
}

export const loadWarEffortFactionModel = (sequelize: Sequelize) => {
    WarEffortFaction.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
        modelName: "war_effort_faction",
        tableName: "war_effort_factions",
        timestamps: false
    });
}

export {
    WarEffortFaction,
    IWarEffortFaction
}