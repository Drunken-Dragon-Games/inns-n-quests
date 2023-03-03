import { DataTypes, Model, Sequelize, Transaction } from "sequelize"
import { QuestRegistry } from "../../registry-quests"
import { IQRuleset, newAvailableQuest, Outcome } from "../game-vm"
import { TakenQuest } from "../models"

export interface ITakenQuestDB {
    takenQuestId: string
    questId: string
    userId: string
    adventurerIds: string[]
    claimedAt?: Date
    createdAt: Date
    outcome? : Outcome
}

export class TakenQuestDB extends Model implements ITakenQuestDB {
    declare takenQuestId: string
    declare questId: string
    declare userId: string
    declare adventurerIds: string[]
    declare claimedAt?: Date
    declare createdAt: Date
    declare outcome? : Outcome
}

export const TakenQuestDBTableName = "idle_quests_taken_quests"

export const TakenQuestDBTableAttributes = {
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
}

export function configureSequelizeModel(sequelize: Sequelize): void {
    TakenQuestDB.init(TakenQuestDBTableAttributes, {
        sequelize,
        tableName: TakenQuestDBTableName
    })
}

export default class TakenQuestState {

    constructor(
        private readonly questRegistry: QuestRegistry,
        private readonly rules: IQRuleset
    ) { }

    async create(userId: string, questId: string, adventurerIds: string[], createdAt: Date, transaction?: Transaction): Promise<TakenQuest> {
        const takenQuestDB = await TakenQuestDB.create({ userId, questId, adventurerIds, createdAt }, { transaction })
        return makeTakenQuest(this.questRegistry, this.rules)(takenQuestDB)
    }

    async unclaimedTakenQuests(userId: string): Promise<TakenQuest[]> {
        const takenQuests = await TakenQuestDB.findAll({ where: { userId, claimedAt: null } })
        return takenQuests.map(makeTakenQuest(this.questRegistry, this.rules))
    }

    async userTakenQuest(userId: string, takenQuestId: string): Promise<TakenQuest | null> {
        const result = await TakenQuestDB.findOne({ where: { userId, takenQuestId } })
        if (!result) return null
        return makeTakenQuest(this.questRegistry, this.rules)(result)
    }

    async claimQuest(takenQuestId: string, claimedAt: Date, outcome: Outcome, transaction?: Transaction): Promise<void> {
        await TakenQuestDB.update({ claimedAt, outcome }, { where: { takenQuestId }, transaction })
    }

}

const makeTakenQuest = (questRegistry: QuestRegistry, rules: IQRuleset) => (takenQuestDB: ITakenQuestDB): TakenQuest => {
    const quest = questRegistry[takenQuestDB.questId]
    return {
        takenQuestId: takenQuestDB.takenQuestId,
        userId: takenQuestDB.userId,
        availableQuest: newAvailableQuest(rules)(quest),
        adventurerIds: takenQuestDB.adventurerIds,
        claimedAt: takenQuestDB.claimedAt,
        createdAt: takenQuestDB.createdAt,
        outcome: takenQuestDB.outcome
    }
}