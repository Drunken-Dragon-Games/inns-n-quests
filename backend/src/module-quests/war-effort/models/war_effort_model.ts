import { DataTypes, Model, Sequelize } from "sequelize"
import { WarEffortFaction } from './war_effort_factions_model.js'
import ApiError from '../../app/error/api_error.js'

interface IWarEffort {
    id: string
    name: string
    description: string
    started_on: string
    duration: number
    is_active: boolean
    isActive(): Promise<boolean>
    getFactions(): Promise<WarEffortFaction[]>
    getFactionsScore(): Promise<IFactionScore[]>
    getWinningFaction(sequelize: Sequelize): Promise<WarEffortFaction>
}

interface IFactionScore {
    faction: string
    score: number
}

class WarEffort extends Model implements IWarEffort {
    declare id: string;
    declare name: string;
    declare description: string;
    declare started_on: string;
    declare duration: number;
    declare is_active: boolean;

    /** Tells you if the war effort is already finished
     *  @returns True if the war effort is still active or false if it is not
     */
    async isActive(): Promise<boolean> {
        if (Date.parse(this.started_on) + this.duration < Date.now() && this.is_active) {
            await this.update({ is_active: false })
        }
        return this.is_active
    }

    /** Gets a list of all the factions involved in the War Effort
     *  @returns List of factions
     */
    async getFactions(): Promise<WarEffortFaction[]> {
        const factions = await WarEffortFaction.findAll({
            where: {
                war_effort_id: this.id
            }
        });
        return factions
    }

    /** Gets the scores of all the factions involved in the War Effort
     *  @returns List of JSONs that have the name of the faction with its respective score
     */
    async getFactionsScore(): Promise<IFactionScore[]> {
        const factions = await this.getFactions();
        const factionScores = factions.map((faction: WarEffortFaction) => {
            return {
                faction: faction.name,
                score: faction.points
            }
        });
        return factionScores
    }

    /** Gets the faction with more points
     * If there are no factions involved in the War Effort it throws an Api Error
     * @returns Winning Faction
     */
    async getWinningFaction(sequelize: Sequelize): Promise<WarEffortFaction> {
        const winningFaction = await WarEffortFaction.findOne({
            order: [sequelize.fn('max', sequelize.col('points'))],
            where: {
                war_effort: this
            }
        })
        if (winningFaction == null) throw new ApiError(409, "no_factions", "This war effort has no factions")        
        return winningFaction
    }
}

export const loadWarEffortModel = (sequelize: Sequelize) => {
    WarEffort.init({
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
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        started_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: "war_effort",
        tableName: "war_efforts",
        timestamps: false
    })
}

export {
    WarEffort,
    IWarEffort
}