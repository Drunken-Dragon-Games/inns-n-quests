import { SResult } from "../../tools-utils"
import { DailyRecord, WeeklyRecord } from "./records-db"
import { DailyReward, WeeklyReward } from "./rewards-db"

export class Rewards {
    static async createDaily(userId: string, error?: string): Promise<SResult<{}>>{
        const today = new Date().toISOString().split('T')[0]
        const dailyRewardId = `${userId}-${today}`
        const existingReward = await DailyReward.findOne({
            where: {dailyRewardId}
        })
        if (existingReward) return {ctype: "failure", error: `User with ID ${userId} has already received a reward today.`}
        await DailyReward.create({dailyRewardId,userId, reward: error})
        return {ctype: "success"}
    }

    static async completeDaily(userId: string, reward: string): Promise<SResult<{}>>{
        const today = new Date().toISOString().split('T')[0]
        const dailyRewardId = `${userId}-${today}`
        const existingRewardRecord = await DailyReward.findOne({
            where: {dailyRewardId}
        })
        if(!existingRewardRecord) return {ctype: "failure", error: `No reward row was found.`}
        if (existingRewardRecord.reward) return {ctype: "failure", error: `Reward has already been completed.`}
        existingRewardRecord.reward = reward
        await existingRewardRecord.save()
        return {ctype: "success"}
    }
}

export class Records {
    static async createDaily(): Promise<SResult<{}>>{
        const dailyRecordId = new Date().toISOString().split('T')[0]
        const existingRecord = await DailyRecord.findOne({
            where: {dailyRecordId}
        })
        if (existingRecord) return {ctype: "failure", error: `There is already a record for daily rewards being given today.`}
        await DailyRecord.create({dailyRecordId})
        return {ctype: "success"}
    }

    static async completeDaily(rewardTotal: string): Promise<SResult<{}>>{
        const dailyRecordId = new Date().toISOString().split('T')[0]
        const existingRecord = await DailyRecord.findOne({
            where: {dailyRecordId}
        })
        if(!existingRecord) return {ctype: "failure", error: `No record was found.`}
        if (existingRecord.rewardTotal) return {ctype: "failure", error: `Record has already been completed.`}
        existingRecord.rewardTotal = rewardTotal
        await existingRecord.save()
        return {ctype: "success"}
    }
}
