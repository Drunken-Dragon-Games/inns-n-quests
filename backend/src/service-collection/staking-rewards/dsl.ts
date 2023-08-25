import { Op, Transaction } from "sequelize"
import { Result, SResult } from "../../tools-utils"
import { DailyRecord, WeeklyRecord } from "./records-db"
import { DailyReward, WeeklyReward } from "./rewards-db"
import { Calendar } from "../../tools-utils/calendar"

export class Rewards {

    constructor(private readonly calendar: Calendar){}
    async createDaily(userId: string, error?: string): Promise<SResult<{}>>{
        const today = this.calendar.now().toISOString().split('T')[0]
        const dailyRewardId = `${userId}-${today}`
        const existingReward = await DailyReward.findOne({
            where: {dailyRewardId}
        })
        if (existingReward) return {ctype: "failure", error: `User with ID ${userId} has already received a reward today.`}
        //console.log(`creating reward wiht id ${dailyRewardId}`)
        await DailyReward.create({dailyRewardId,userId, reward: error, created: this.calendar.now()})
        return {ctype: "success"}
    }

    async completeDaily(userId: string, reward: string): Promise<SResult<{}>>{
        const today = this.calendar.now().toISOString().split('T')[0]
        const dailyRewardId = `${userId}-${today}`
        const existingRewardRecord = await DailyReward.findOne({
            where: {dailyRewardId}
        })
        if(!existingRewardRecord) return {ctype: "failure", error: `No reward row was found.`}
        if (existingRewardRecord.reward) return {ctype: "failure", error: `Reward has already been completed.`}
        //console.log(`adding reard to ${dailyRewardId}`)
        existingRewardRecord.reward = reward
        await existingRewardRecord.save()
        return {ctype: "success"}
    }

    async getWeeklyAccumulated(userId: string){
        try{const now = this.calendar.now()
        const weekNumber= getWeekNumber(now)
        const [weekStart, weekEnd] = getDateRangeOfWeek(weekNumber.weekNo, weekNumber.year)
        /* console.log(`${now.toISOString().split('T')[0]} should be between
        ${weekStart.toISOString().split('T')[0]} and
        ${weekEnd.toISOString().split('T')[0]}
        `) */
        const dailyRewards = await DailyReward.findAll({
            where: {
                userId,
                created: {
                    [Op.between]: [weekStart, weekEnd]
                }
            }
        })
        //console.log(dailyRewards)
        return dailyRewards.reduce((acc, dailyReward) => acc + Number(dailyReward.reward), 0) } 
        catch(e: any){
            console.log(e)
            return 0
        }
    }

    async createWeekly(userId: string): Promise<SResult<{}>>{
        const oneWeekAgo = getOneWeekBefore(this.calendar.now())
        const weekNumber= getWeekNumber(oneWeekAgo)
        const weeklyRewardId = `${userId}-${weekNumber.weekNo}-${weekNumber.year}`
        const existingReward = await WeeklyReward.findOne({
            where: {weeklyRewardId}
        })
        if (existingReward) return {ctype: "failure", error: `User with ID ${userId} has already received a reward this week.`}
        await WeeklyReward.create({weeklyRewardId, userId})
        return {ctype: "success"}
    }

    async completeWeekly(userId: string, reward: string): Promise<SResult<{}>>{
        const oneWeekAgo = getOneWeekBefore(this.calendar.now())
        const weekNumber= getWeekNumber(oneWeekAgo)
        const weeklyRewardId = `${userId}-${weekNumber.weekNo}-${weekNumber.year}`
        const existingReward = await WeeklyReward.findOne({
            where: {weeklyRewardId}
        })
        if(!existingReward) return {ctype: "failure", error: `No reward record was found.`}
        if (existingReward.reward) return {ctype: "failure", error: `Reward has already been completed.`}
        existingReward.reward = reward
        await existingReward.save()
        return {ctype: "success"}
    }

    async getPreviusWeekTotals(): Promise<{[userId: string]: number}> {
        //CHECKME: temporrly mkaing this work on current week
        //const oneWeekAgo = getOneWeekBefore(this.calendar.now())
        const oneWeekAgo = this.calendar.now()
        const weekNumber= getWeekNumber(oneWeekAgo)
        const [weekStart, weekEnd] = getDateRangeOfWeek(weekNumber.weekNo, weekNumber.year)
        const dailyRewards = await DailyReward.findAll({
            where: {
                created: {
                    [Op.between]: [weekStart, weekEnd]
                }
            }
        })
        return dailyRewards.reduce((acc: {[userId: string]: number}, dailyReward) => {
            acc[dailyReward.userId] = (acc[dailyReward.userId] || 0) + parseFloat(dailyReward.reward)
            return acc
        }, {})
    }
}

export class Records {

    constructor(private readonly calendar: Calendar){}
    async createDaily(): Promise<SResult<{}>>{
        try{const dailyRecordId = this.calendar.now().toISOString().split('T')[0]
        const existingRecord = await DailyRecord.findOne({
            where: {dailyRecordId}
        })
        if (existingRecord) return {ctype: "failure", error: `There is already a record for daily rewards being given today.`}
        await DailyRecord.create({dailyRecordId})
        return {ctype: "success"}}
        catch(e: any){
            console.log(e)
            return {ctype: "failure", error: e}
        }
    }

    async completeDaily(rewardTotal: string): Promise<SResult<{}>>{
        const dailyRecordId = this.calendar.now().toISOString().split('T')[0]
        const existingRecord = await DailyRecord.findOne({
            where: {dailyRecordId}
        })
        if(!existingRecord) return {ctype: "failure", error: `No record was found.`}
        if (existingRecord.rewardTotal) return {ctype: "failure", error: `Record has already been completed.`}
        existingRecord.rewardTotal = rewardTotal
        await existingRecord.save()
        return {ctype: "success"}
    }

    async createWeekly(): Promise<SResult<{}>>{
        try{
            //Temporary making this work on current week
        //const oneWeekAgo = getOneWeekBefore(this.calendar.now())
        const oneWeekAgo = getOneWeekBefore(this.calendar.now())
        const weekNumber= getWeekNumber(oneWeekAgo)
        const weeklyRecordId = `${weekNumber.weekNo}-${weekNumber.year}`
        const existingRecord = await WeeklyRecord.findOne({
            where: {weeklyRecordId}
        })
        if (existingRecord) return {ctype: "failure", error: `There is already a record for weekly rewards being given this week.`}
        await WeeklyRecord.create({weeklyRecordId})
        return {ctype: "success"}}
        catch (e:any){
            console.log(e)
            return {ctype: "failure", error: e.mesagge}
        }
    }

    async completeWeekly(rewardTotal: string): Promise<SResult<{}>>{
        const oneWeekAgo = getOneWeekBefore(this.calendar.now())
        const weekNumber= getWeekNumber(oneWeekAgo)
        const weeklyRecordId = `${weekNumber.weekNo}-${weekNumber.year}`
        const existingRecord = await WeeklyRecord.findOne({
            where: {weeklyRecordId}
        })
        if(!existingRecord) return {ctype: "failure", error: `No record was found.`}
        if (existingRecord.rewardTotal) return {ctype: "failure", error: `Record has already been completed.`}
        existingRecord.rewardTotal = rewardTotal
        await existingRecord.save()
        return {ctype: "success"}
    }
}

/**
 * @returns The ISO 8601 week number.
 * 
 * - According to the ISO 8601 standard The first week of the year is the one that includes the first Thursday.
 * - Milliseconds are converted to days (86400000 is the number of milliseconds in a day) for calculations.
 * - Partial weeks are rounded up as they count as full weeks.
 * - ISO 8601 treats Monday as the first day of the week, not Sunday.
 * 
 * Source: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 */
const getWeekNumber = (d: Date): {weekNo: number, year: number} => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
    const  weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7)
    return {weekNo, year: d.getUTCFullYear()}
}

const getDateRangeOfWeek = (weekNumber: number, year: number): [Date, Date] => {
    // Start with the first day of the year
    const startDate = new Date(Date.UTC(year, 0, 1))
    
    // Find the first Thursday of the year
    while (startDate.getUTCDay() !== 4) {
        startDate.setUTCDate(startDate.getUTCDate() + 1)
    }
    
    // Get to the start (Monday) of this first week
    startDate.setUTCDate(startDate.getUTCDate() - 3) 

    // Adjust for the desired week number
    startDate.setUTCDate(startDate.getUTCDate() + (weekNumber - 1) * 7)

    //getting that weeks last milisecond
    const endDate = new Date(startDate)
    endDate.setUTCDate(startDate.getUTCDate() + 6)
    endDate.setUTCHours(23, 59, 59, 999)
    
    return [startDate, endDate]
}

const getOneWeekBefore = (d: Date): Date => {
    const result = new Date(d)
    result.setDate(d.getDate() - 7)
    return result
}
