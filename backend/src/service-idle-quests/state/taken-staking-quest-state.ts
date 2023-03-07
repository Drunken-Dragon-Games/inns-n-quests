import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
import { StakingQuestRegistry } from "./staking-quests-registry"
import { TakenStakingQuest } from "../models"
import * as vm from "../game-vm"

export interface ITakenStakingQuestDB {
    takenQuestId: string
    questId: string
    userId: string
    adventurerIds: string[]
    claimedAt?: Date
    createdAt: Date
    outcome? : vm.StakingQuestOutcome
}

export class TakenStakingQuestDB extends Model implements ITakenStakingQuestDB {
    declare takenQuestId: string
    declare questId: string
    declare userId: string
    declare adventurerIds: string[]
    declare claimedAt?: Date
    declare createdAt: Date
    declare outcome? : vm.StakingQuestOutcome
}

export const TakenStakingQuestDBInfo = {

    tableName: "idle_quests_taken_quests",

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
        adventurerIds: {
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
        private readonly objectBuilder: vm.IQMeatadataObjectBuilder
    ) { }

    async create(userId: string, questId: string, adventurerIds: string[], createdAt: Date, transaction?: Transaction): Promise<TakenStakingQuest> {
        const takenQuestDB = await TakenStakingQuestDB.create({ userId, questId, adventurerIds, createdAt }, { transaction })
        return makeTakenQuest(this.questRegistry, this.objectBuilder)(takenQuestDB)
    }

    async unclaimedTakenQuests(userId: string): Promise<TakenStakingQuest[]> {
        const takenQuests = await TakenStakingQuestDB.findAll({ where: { userId, claimedAt: null } })
        return takenQuests.map(makeTakenQuest(this.questRegistry, this.objectBuilder))
    }

    async userTakenQuest(userId: string, takenQuestId: string): Promise<TakenStakingQuest | null> {
        const result = await TakenStakingQuestDB.findOne({ where: { userId, takenQuestId } })
        if (!result) return null
        return makeTakenQuest(this.questRegistry, this.objectBuilder)(result)
    }

    async claimQuest(takenQuestId: string, claimedAt: Date, outcome: vm.StakingQuestOutcome, transaction?: Transaction): Promise<void> {
        await TakenStakingQuestDB.update({ claimedAt, outcome }, { where: { takenQuestId }, transaction })
    }

}

const makeTakenQuest = (questRegistry: StakingQuestRegistry, objectBuilder: vm.IQMeatadataObjectBuilder) => (takenQuestDB: ITakenStakingQuestDB): TakenStakingQuest => {
    const quest = questRegistry[takenQuestDB.questId]
    return {
        ctype: "taken-staking-quest",
        takenQuestId: takenQuestDB.takenQuestId,
        userId: takenQuestDB.userId,
        availableQuest: objectBuilder.newAvailableStakingQuest(quest),
        adventurerIds: takenQuestDB.adventurerIds,
        claimedAt: takenQuestDB.claimedAt,
        createdAt: takenQuestDB.createdAt,
        outcome: takenQuestDB.outcome
    }
}