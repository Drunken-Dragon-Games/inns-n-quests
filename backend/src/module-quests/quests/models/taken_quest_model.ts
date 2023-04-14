import { DataTypes, Model, Optional, Sequelize, Transaction } from "sequelize";
import { Quest, IQuest } from "./quest_model.js";
import { Enrolled, IEnroll } from "./enroll_model.js";
import { questOutcome } from "../utils.js";
import { IPlayer, Player } from "../../players/models/player_model.js";
import { adventurerDeath } from "../../adventurers/utils.js";
import { Adventurer, IDeadAdventurerData } from "../../adventurers/models/adventurer_model.js";
import { handleQuestsByAdventurerLevel,
         calculateRewardMultiplicator } from "../utils.js";
import { IFilteredAdventurers } from "../../app/types.js";
import { LoggingContext } from "../../../tools-tracing/index.js"
import { AssetManagementService } from "../../../service-asset-management/index.js";
import { WellKnownPolicies } from "../../../registry-policies.js";

interface ITakenQuest {
    id?: string
    started_on?: string
    state?: string
    user_id: string
    quest_id: string
    quest?: Quest
    enrolls?: IEnroll[]
    is_claimed?: boolean
    player?: IPlayer
    calculateQuestOutcome(): void
    claim(sequelize: Sequelize, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies, logger: LoggingContext): Promise<{ id: string, experience: number}[]>
    checkAdventurersStatus(transaction?: Transaction): Promise<IDeadAdventurerData[]>
    getRewardMultiplicator(): Promise<number>
    levelAdventurers(multiplicator: number, transaction: Transaction): Promise<{ id: string, experience: number}[]>
    fail(sequelize: Sequelize): Promise<IDeadAdventurerData[]>
    getRequirementBonus(): Promise<number>
    getAdventurers(): Promise<Adventurer[]>
}

type ITakenQuestCreation = Optional<ITakenQuest, 'id' | 'started_on' | 'state'>

class TakenQuest extends Model implements ITakenQuest{
    declare id: string
    declare started_on: string
    declare state: string
    declare user_id: string
    declare quest_id: string
    declare quest: Quest 
    declare enrolls: IEnroll[]
    declare is_claimed: boolean

    async calculateQuestOutcome() {
        const adventurerLevels: number[] = this.enrolls.map(enroll => {
            return enroll.adventurer?.getLevel()!
        });                
        const bonus = await this.getRequirementBonus()        
        const state = questOutcome(this.quest.difficulty, this.quest.slots, adventurerLevels, bonus);        
        this.state = state;                
        await this.save()        
    }

    async claim(sequelize: Sequelize, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies, logger: LoggingContext) {
        const player: Player | null = await Player.findOne({
            where: {
                user_id: this.user_id
            }
        })
        const adventurerData = await sequelize.transaction(async t => {
            const multiplicator = await this.getRewardMultiplicator();
            const adventurerData = await this.levelAdventurers(multiplicator, t);
            if(this.quest.is_war_effort) {
                const warEffortQuest = await this.quest.getWarEffortQuest();
                await player?.addWep(warEffortQuest.reward_wep, t);
                await warEffortQuest.rewardFaction(t);
            }
            await this.update({ is_claimed: true}, { transaction: t});
            await Enrolled.destroy({
                where: {
                    taken_quest_id: this.id
                },
                transaction: t
            })
            await player?.addDs(Math.round(this.quest.reward_ds * multiplicator), assetManagementService, wellKnownPolicies, logger)
            return adventurerData
        });
        return adventurerData
    }

    async fail(sequelize: Sequelize) {
        const adventurerData = await sequelize.transaction(async t => {
            await this.update({ is_claimed: true}, { transaction: t});
            await Enrolled.destroy({
                where: {
                    taken_quest_id: this.id
                },
                transaction: t
            });
            return await this.checkAdventurersStatus(t);
        })
        return adventurerData;
    }

    async checkAdventurersStatus(transaction: Transaction): Promise<IDeadAdventurerData[]> {
        let deadAdventurerData: IDeadAdventurerData[] = new Array();
        for (let i = 0; i < this.enrolls.length; i++) {
            if(adventurerDeath(this.enrolls[i].adventurer?.getLevel()!, this.quest.difficulty)){
                let adventurerData = await this.enrolls[i].adventurer?.kill();
                deadAdventurerData.push(adventurerData!);
            } else {
                await Adventurer.update({ in_quest: false}, { 
                    where: { id: this.enrolls[i].adventurer?.id },
                    transaction: transaction
                });
            }
        }
        return deadAdventurerData;
    }

    async getRewardMultiplicator(): Promise<number> {
        const xpMin: number = await Adventurer.min('experience', { where: { user_id: this.user_id}});
        const xpMax: number = await Adventurer.max('experience', { where: { user_id: this.user_id}});

        let levelSum: number = 0;
        this.enrolls.forEach(enroll => {
            levelSum += enroll.adventurer?.getLevel()!
        })
        let averageLevel: number = levelSum/this.quest.slots;

        const filter: IFilteredAdventurers[] = handleQuestsByAdventurerLevel(xpMin, xpMax);
        const lastFilter = filter[filter.length - 1];
        let multiplicator: number = 1;
        if (this.quest.difficulty > lastFilter.min_level) multiplicator = calculateRewardMultiplicator(this.quest.difficulty, averageLevel)
        return multiplicator
    }

    async levelAdventurers(multiplicator: number, transaction: Transaction) {
        let adventurerData: { id: string, experience: number}[] = new Array()
        for (let i = 0; i < this.enrolls.length; i++) {
            let gainedXP = this.enrolls[i].adventurer?.calculateGainedXP(this.quest.difficulty)! * this.quest.reward_xp * multiplicator;
            await this.enrolls[i].adventurer?.addXP(gainedXP, transaction)
            await this.enrolls[i].adventurer!.changeInQuest(false, transaction)
            adventurerData.push({ id: this.enrolls[i].adventurer?.id!, experience: this.enrolls[i].adventurer?.experience! })      
        }
        return adventurerData
    }

    async getRequirementBonus(): Promise<number> {
        const adventurers = await this.getAdventurers();
        const requirements = this.quest.validateRequirements(adventurers);
        const fulfilledRequirements = requirements.filter(requirement => requirement);
        const fullfilledPercentage: number = fulfilledRequirements.length / requirements.length;
        
        /* CHECKME 
        * If a quest has no requirements, "fullfilledPercentage" will equal to Not a Number (NaN)
        * In that case, bonus will be automatically 0 and the aritmetic operation will be skipped
        */
        const bonus: number = !Object.is(fullfilledPercentage, NaN) ? ((fullfilledPercentage * 30) - 15) * .01 : 0;   
        return bonus;
    }

    async getAdventurers(): Promise<Adventurer[]> {
        let adventurerIds: string[] = new Array();
        this.enrolls.forEach(enroll => {
            adventurerIds.push(enroll.adventurer_id)
        });
        let adventurers = await Adventurer.findAll({
            where: {
                id: adventurerIds
            }
        });
        return adventurers;
    }
}

export const loadTakenQuestModel = (sequelize: Sequelize) => {
    TakenQuest.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        started_on: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "in_progress"
        },
        is_claimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: "taken_quest",
        tableName: "taken_quests",
        timestamps: false
    })
}

export {
    TakenQuest,
    ITakenQuest,
    ITakenQuestCreation
}