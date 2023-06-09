import path from "path"
import { QueryInterface, Sequelize } from "sequelize"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import { GovernanceService } from "./service-spec.js"
import dotenv from "dotenv"

import * as models from "./models.js"
import * as ballotDB from "./ballots/ballots-db.js"

import { config, HealthStatus } from "../tools-utils"

import { Ballots } from "./ballots/ballot-dsl.js"
import { title } from "process"

export type GovernanceServiceDependencies = {
    database: Sequelize
}

export type GovernanceServiceConfig = {

}

export class GovernanceServiceDsl implements GovernanceService {

    private readonly migrator: Umzug<QueryInterface>

    constructor(
        private readonly database: Sequelize
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: GovernanceServiceDependencies): Promise<GovernanceService> {
        dotenv.config()
        return await GovernanceServiceDsl.loadFromConfig({}, dependencies)
    }
    static async loadFromConfig(servConfig: GovernanceServiceConfig, dependencies: GovernanceServiceDependencies): Promise<GovernanceService> {
        const service = new GovernanceServiceDsl( dependencies.database)
            
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        ballotDB.configureSequelizeModel(this.database)
        await this.migrator.up()
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
        await this.database.close()
    }

    async health(): Promise<HealthStatus> {
        let dbHealth: "ok" | "faulty"
        try { await this.database.authenticate(); dbHealth = "ok" }
        catch (e) { console.error(e); dbHealth = "faulty" }
        return {
            status: dbHealth,
            dependencies: [{ name: "database", status: dbHealth }]
        }
    }

    async addBallot(ballot: models.registerBallotType):Promise<models.RegisterBallotResponse>{
        return await Ballots.register(ballot)
    }

    async getAdminBallotCollection(limit: number = 6): Promise<models.AdminBallotCollection> {
        try {
            const ballotsDetails = await Ballots.getAllDetails(limit)
            if (ballotsDetails.ctype === "error") throw new Error(ballotsDetails.reason)
            const adminBallots: { [ballotId: string]: models.AdminBallot } = {}
            for (const ballotId in ballotsDetails.ballots) {
                const ballot: models.BallotData = ballotsDetails.ballots[ballotId]
                adminBallots[ballotId] = {
                    status: ballot.status,
                    id: ballot.id,
                    inquiry: ballot.inquiry,
                    inquiryDescription: ballot.inquiryDescription,
                    options: ballot.options,
                }
            }

            return  { ctype: "success", ballots: adminBallots }
            
        }catch(e: any){
            return {ctype: "error", reason: e.message}
        }
    }

    async getPublicBallotCollection(): Promise<models.PublicBallotCollection> {
        try {
            const allBallotsDetails = await Ballots.getAllDetails(6)
            if (allBallotsDetails.ctype === "error") throw new Error(allBallotsDetails.reason)
    
            const publicBallots: { [ballotId: string]: models.PublicBallot } = {}
    
            for (const ballotId in allBallotsDetails.ballots) {
                const ballotDetails: models.BallotData = allBallotsDetails.ballots[ballotId]
                
                if (ballotDetails.status === "open") {
                    const options: models.BaseOption[] = ballotDetails.options.map(option => ({ title: option.title, description: option.description }))
                    publicBallots[ballotId] = {
                        status: "open",
                        id: ballotDetails.id,
                        inquiry: ballotDetails.inquiry,
                        inquiryDescription: ballotDetails.inquiryDescription,
                        options
                    }
                } else {
                    //TODO: this is ignoring the archived ctype as it not yet implemented
                    const maxDragonGoldInBallot = Ballots.getMaxDragonGold(ballotDetails.options)
                    const options: models.ClosedOption[] = ballotDetails.options.map(option => ({ 
                        title: option.title, 
                        description: option.description, 
                        lockedInDragonGold: option.lockedInDragonGold, 
                        isWinner: option.lockedInDragonGold === maxDragonGoldInBallot
                    }))
                    publicBallots[ballotId] = {
                        status: "closed",
                        id: ballotDetails.id,
                        inquiry: ballotDetails.inquiry,
                        inquiryDescription: ballotDetails.inquiryDescription,
                        options
                    }
                }
            }
    
            return { ctype: "success", ballots: publicBallots }
    
        } catch (e: any) {
            return { ctype: "error", reason: e.message }
        }
    }
    
    async getUserBallotCollection(userId: string): Promise<models.UserBallotCollection> {
        try {
            const allBallotsDetails = await Ballots.getAllDetails(6)
            if (allBallotsDetails.ctype === "error") throw new Error(allBallotsDetails.reason)
    
            const userBallots: { [ballotId: string]: models.UserBallot } = {}
    
            for (const ballotId in allBallotsDetails.ballots) {
                const ballotDetails: models.BallotData = allBallotsDetails.ballots[ballotId]
                
                const vote = await Ballots.getVote(userId, ballotId)

                if (ballotDetails.status === "open") {
                    const options: models.VotedOption[] = ballotDetails.options.map((option, index) => ({ title: option.title, description: option.description, isVotedByUser: index === vote }))
                    userBallots[ballotId] = {
                        status: "open",
                        id: ballotDetails.id,
                        hasVoted: vote !== "none",
                        inquiry: ballotDetails.inquiry,
                        inquiryDescription: ballotDetails.inquiryDescription,
                        options: options
                    }
                } else {
                    const maxDragonGoldInBallot = Ballots.getMaxDragonGold(ballotDetails.options)
                    const options: models.UserClosedOption[] = ballotDetails.options.map((option, index) => ({ 
                        title: option.title, 
                        description: option.description, 
                        lockedInDragonGold: option.lockedInDragonGold, 
                        isWinner: option.lockedInDragonGold === maxDragonGoldInBallot,
                        isVotedByUser: index === vote
                    }))
                    userBallots[ballotId] = {
                        status: "closed",
                        id: ballotDetails.id,
                        inquiry: ballotDetails.inquiry,
                        hasVoted: vote !== "none",
                        inquiryDescription: ballotDetails.inquiryDescription,
                        options: options
                    }
                }
            }
    
            return  { ctype: "success", ballots: userBallots }
    
        } catch(e: any){
            return { ctype: "error", reason: e.message }
        }
    }

    

    async getBallots(state?: models.BallotState | undefined): Promise<models.MultipleBallots> {
        return Ballots.getMultiple(state)
    }

    async getUserOpenBallots(userId: string): Promise<models.MultipleUserBallots> {
        return Ballots.getUserBallots(userId)
    }

    async getBallot(ballotId: string): Promise<models.GetBallotResponse> {
        return await Ballots.getSingle(ballotId)
    }

    async closeBallot(ballotId: string): Promise<models.CloseBallotResponse> {
       return await Ballots.close(ballotId)
    }

    async voteForBallot(ballotId: string, optionIndex: number, userId: string, dragonGold: string): Promise<models.voteResponse> {
        return await Ballots.vote(ballotId, optionIndex, userId, dragonGold)
    }

}

