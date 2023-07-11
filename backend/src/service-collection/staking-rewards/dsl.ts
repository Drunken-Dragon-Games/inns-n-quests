import { Op } from "sequelize"
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

    static async getWeeklyAccumulated(userId: string){
        const [weekStart, _weekEnd] = getCurrentWeekDates()
        const dailyRewards = await DailyReward.findAll({
            where: {
                userId,
                createdAt: {
                    [Op.between]: [`${weekStart}T00:00:00Z`, new Date()]
                }
            }
        })

        return dailyRewards.reduce((acc, dailyReward) => acc + Number(dailyReward.reward), 0)
        
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

/**
 * Returns the ISO 8601 week number of the provided date.
 * 
 * Important points:
 * - ISO 8601 standard: The first week of the year is the one that includes the first Thursday.
 * - Milliseconds are converted to days (86400000 is the number of milliseconds in a day) for calculations.
 * - Partial weeks are rounded up as they count as full weeks.
 * - ISO 8601 treats Monday as the first day of the week, not Sunday.
 */
const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
    const  weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7)
    return weekNo
}

const getDateRangeOfWeek = (weekNo: number, year: number): [Date, Date] => {
    const d1 = new Date(year, 0, 1 + (weekNo - 1) * 7)
    const d2 = new Date(d1.valueOf())
    d2.setUTCDate(d1.getUTCDate() + 6)
    return [d1, d2]
}

const getCurrentWeekDates = () => {
    const currDate = new Date()
    const currWeekDay = currDate.getUTCDay()
    
    const firstDayUTC = new Date(currDate.valueOf())
    firstDayUTC.setUTCDate(currDate.getUTCDate() - currWeekDay + 1)  // Monday
    const lastDayUTC = new Date(firstDayUTC.valueOf())
    lastDayUTC.setUTCDate(firstDayUTC.getUTCDate() + 6)  // Sunday

    return [firstDayUTC.toISOString().split('T')[0], lastDayUTC.toISOString().split('T')[0]]
}
