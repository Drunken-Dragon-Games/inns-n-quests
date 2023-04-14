import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
import * as vm from "../game-vm.js"
import { ActiveEncounter } from "../models.js"

export interface IActiveEncounterDB {
    activeEncounterId: string
    encounterId: string
    chosenStrategyIndex: number
    userId: string
    party: string[]
    claimedAt?: Date
    createdAt: Date
    outcome?: vm.EncounterOutcome
}

export class ActiveEncounterDB extends Model implements IActiveEncounterDB {
    declare activeEncounterId: string
    declare encounterId: string
    declare chosenStrategyIndex: number
    declare userId: string
    declare party: string[]
    declare claimedAt?: Date
    declare createdAt: Date
    declare outcome?: vm.EncounterOutcome
}

export const ActiveEncounterDBInfo = {

    tableName: "idle_quests_active_encounters",

    tableAttributes: {
        activeEncounterId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        encounterId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        chosenStrategyIndex: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        party: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        claimedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        outcome: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: null
        }
    },

    configureSequelizeModel(sequelize: Sequelize): void {
        ActiveEncounterDB.init(this.tableAttributes, {
            sequelize,
            tableName: this.tableName
        })
    }
}

export class ActiveEncounterState {

    constructor(
    ) { }

    async create(userId: string, encounterId: string, adventurerIds: string[], createdAt: Date, transaction?: Transaction): Promise<ActiveEncounter> {
        const activeEncounterDB = await ActiveEncounterDB.create({ userId, encounterId, adventurerIds, createdAt }, { transaction })
        return makeActiveEncounter(activeEncounterDB)
    }

    async unclaimedActiveEncounters(userId: string): Promise<ActiveEncounter[]> {
        const takenQuests = await ActiveEncounterDB.findAll({ where: { userId, claimedAt: null } })
        return takenQuests.map(makeActiveEncounter)
    }

    async userActiveEncounter(userId: string, activeEncounterId: string): Promise<ActiveEncounter | null> {
        const result = await ActiveEncounterDB.findOne({ where: { userId, activeEncounterId } })
        if (!result) return null
        return makeActiveEncounter(result)
    }

    async claim(activeEncounterId: string, claimedAt: Date, outcome: vm.EncounterOutcome, transaction?: Transaction): Promise<void> {
        await ActiveEncounterDB.update({ claimedAt, outcome }, { where: { activeEncounterId }, transaction })
    }
}

const makeActiveEncounter = (activeEncounterDB: ActiveEncounterDB): ActiveEncounter => {
    const encounter = vm.testEncounter
    return {
        ctype: "active-encounter",
        activeEncounterId: activeEncounterDB.activeEncounterId,
        userId: activeEncounterDB.userId,
        encounter,
        chosenStrategyIndex: activeEncounterDB.chosenStrategyIndex,
        party: activeEncounterDB.party,
        claimedAt: activeEncounterDB.claimedAt,
        createdAt: activeEncounterDB.createdAt,
        outcome: activeEncounterDB.outcome
    }
}
