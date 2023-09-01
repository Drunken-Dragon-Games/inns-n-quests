import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
import { Op, literal, fn, col } from 'sequelize'
import { StakingQuestRegistry } from "./staking-quests-registry"
import { Leaderboard, TakenStakingQuest } from "../models"
import * as vm from "../game-vm"
import { succeeded } from "../../tools-utils"

export interface ITakenStakingQuestDB {
    takenQuestId: string
    questId: string
    userId: string
    partyIds: string[]
    claimedAt?: Date
    createdAt: Date
    outcome? : vm.StakingQuestOutcome
}

export class TakenStakingQuestDB extends Model implements ITakenStakingQuestDB {
    declare takenQuestId: string
    declare questId: string
    declare userId: string
    declare partyIds: string[]
    declare claimedAt?: Date
    declare createdAt: Date
    declare outcome? : vm.StakingQuestOutcome
}

export const TakenStakingQuestDBInfo = {

    tableName: "idle_quests_staking_taken_quests",

    tableAttributes: {
        takenQuestId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        questId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        partyIds: {
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
        TakenStakingQuestDB.init(this.tableAttributes, {
            sequelize,
            tableName: this.tableName
        })
    }
}

export class TakenStakingQuestState {

    constructor(
        private readonly questRegistry: StakingQuestRegistry,
    ) { }

    async create(data: { userId: string, questId: string, partyIds: string[], createdAt: Date }, transaction?: Transaction): Promise<TakenStakingQuest> {
        const takenQuestDB = await TakenStakingQuestDB.create(data, { transaction })
        return makeTakenQuest(this.questRegistry)(takenQuestDB)
    }

    async unclaimedTakenQuests(userId: string): Promise<TakenStakingQuest[]> {
        const takenQuests = await TakenStakingQuestDB.findAll({ where: { userId, claimedAt: null } })
        return takenQuests.map(makeTakenQuest(this.questRegistry))
    }

    async userTakenQuest(userId: string, takenQuestId: string): Promise<TakenStakingQuest | null> {
        const result = await TakenStakingQuestDB.findOne({ where: { userId, takenQuestId } })
        if (!result) return null
        return makeTakenQuest(this.questRegistry)(result)
    }

    async claimQuest(takenQuestId: string, claimedAt: Date, outcome: vm.StakingQuestOutcome, transaction?: Transaction): Promise<void> {
        await TakenStakingQuestDB.update({ claimedAt, outcome }, { where: { takenQuestId }, transaction })
    }

    async getLeaderboard(size: number, start: Date, end: Date): Promise<Leaderboard> {
        const leaderboardArray = await TakenStakingQuestDB.findAll({
            where: {
                claimedAt: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                },
                outcome: {
                    [Op.and]: [literal(`outcome->>'ctype' = 'success-outcome'`)],
                },
            }
        })
        const leaderboardObject = leaderboardArray.reduce((acc, entry) => {
            if (!acc[entry.userId]) return {...acc, [entry.userId]: 1}
            else return {...acc, [entry.userId]: acc[entry.userId] + 1}
        }, {} as {[userId: string]: number})

        return Object.entries(leaderboardObject)
            .sort((a, b) => b[1] - a[1])
            .slice(0, size)
            .map(([userId, succeededQuests]) => ({userId, succeededQuests}))
    }

}

const makeTakenQuest = (questRegistry: StakingQuestRegistry) => (takenQuestDB: ITakenStakingQuestDB): TakenStakingQuest => {
    const quest = questRegistry[takenQuestDB.questId]
    return {
        ctype: "taken-staking-quest",
        takenQuestId: takenQuestDB.takenQuestId,
        userId: takenQuestDB.userId,
        availableQuest: quest,
        partyIds: takenQuestDB.partyIds,
        claimedAt: takenQuestDB.claimedAt,
        createdAt: takenQuestDB.createdAt,
        outcome: takenQuestDB.outcome
    }
}