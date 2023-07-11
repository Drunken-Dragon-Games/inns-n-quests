import { SResult } from "../../tools-utils"
import { DailyContribution, WeeklyContribution } from "./contributions-db"
import moment from 'moment'
export class Contributions {
    static async createDaily(userId: string, contribution: string): Promise<SResult<{}>>{
        const today = moment().format('YYYY-MM-DD')
        const dailyContributionId = `${userId}-${today}`
        const existingContribution = await DailyContribution.findOne({
            where: {
                dailyContributionId: dailyContributionId,
            }
        })
        if (existingContribution) return {ctype: "failure", error: `User with ID ${userId} has already made a contribution today.`}
        await DailyContribution.create({
            dailyContributionId: dailyContributionId,
            contribution: contribution,
            userId: userId
        })
        return {ctype: "success"}
    }
}