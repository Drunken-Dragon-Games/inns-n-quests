import { BallotState, CloseBallotResponse, GetBallotResponse, MultipleBallots, RegisterBallotResponse, StoredBallot, StoredUserBallot, MultipleUserBallots, BallotRegistration, VoteResponse, AllBallotData, BallotData, BallotOption, BallotVotesResponse } from "../models"
import { Ballot, BallotVote } from "./ballots-db"

export class Ballots {

    static async register(ballot: BallotRegistration): Promise<RegisterBallotResponse> {
        const optionTitles = ballot.options.map(option => option.title)
        const optionDescriptions = ballot.options.map(option => option.description)
        try {
            return {
                ctype: "success", ballotId: (await Ballot.create({
                    inquiry: ballot.question.inquiry,
                    description: ballot.question.description,
                    state: 'open',
                    options: JSON.stringify(optionTitles),
                    descriptions: JSON.stringify(optionDescriptions),
                    url: ballot.url
                })).ballotId
            }
        } catch (e: any) {
            return { ctype: "error", reason: e.message }
        }
    }

    //{ctype: "succes", ballot: Ballot ,votes: BallotVote[]} | {ctype: "error", reason: string}
    static async getSingle(ballotId: string): Promise<{ctype: "succes", ballot: Ballot ,votes: BallotVote[]} | {ctype: "error", reason: string}>{
        try{
            const unprossedBallot = await Ballot.findByPk(ballotId)
            if (!unprossedBallot) return {ctype: "error", reason: "unknown Ballot ID"}
            const votes = await BallotVote.findAll({where: { ballotId}})
            return {ctype: "succes", ballot: unprossedBallot, votes}
        } catch(error: any){
            return { ctype: "error", reason: error.message }
        }
        
    }

    static async getMultiple(state?: BallotState): Promise<MultipleBallots> {
        try {

            const ballots = await Ballot.findAll(state ? { where: { state } } : {})
            const storedBallots: { [ballotId: string]: StoredBallot } = {}

            for (const ballot of ballots) {
                const votes = await BallotVote.findAll({ where: { ballotId: ballot.ballotId } })
                const processedBallot = Ballots.processSingleBallot(ballot, votes)
                storedBallots[ballot.ballotId] = processedBallot
            }
            return { ctype: "success", ballots: storedBallots }

        } catch (error: any) {
            return { ctype: "error", reason: error.message }
        }
    }

    static async getUserBallots(userId: string, state?: BallotState): Promise<MultipleUserBallots> {
        try{
            const ballots = await Ballot.findAll({ limit: 6, order: [["createdAt", "DESC"]], ...(state ? { where: { state } } : {})})
            const storedUserBallots:  { [ballotId: string]: StoredUserBallot } = {}
            for (const ballot of ballots) { 
                const options = ballot.optionsArray.map((option, index) => ({option, description: ballot.descriptionArray[index]}))
                const exisitingVote = await BallotVote.findOne({where: {ballotId: ballot.ballotId, userId}})
                storedUserBallots[ballot.ballotId] = {
                    id: ballot.ballotId, 
                    inquiry: ballot.inquiry, 
                    descriptionOfInquiry: ballot.description, 
                    options, 
                    state: ballot.state, 
                    voteRegistered: !!exisitingVote
                }
            }
            return {ctype: "success", ballots: storedUserBallots}
        } catch (e: any){
            return { ctype: "error", reason: e.message }
        }
         
    }

    static async getAllDetails(limit: number, state?: BallotState): Promise<AllBallotData> {
        try{
            const ballots = await Ballot.findAll({ limit, order: [["createdAt", "DESC"]], ...(state ? { where: { state } } : {})})
            const ballotData: {[ballotId: string]: BallotData} = {}
            for (const ballot of ballots) { 
                const votes = await BallotVote.findAll({where: { ballotId: ballot.ballotId }})
                const formatedBallot = Ballots.formatBallotData(ballot, votes)
                ballotData[ballot.ballotId] = formatedBallot
            }
            return {ctype: "success", ballots: ballotData}
        } catch (e: any){
            return { ctype: "error", reason: e.message }
        }
    }

    static async getVote(userId: string, ballotId: string): Promise<number | "none"> {
        const vote = await BallotVote.findOne({where: {ballotId: ballotId, userId}})
        if (!vote) return "none"
        else return vote.optionIndex
    }

    static formatBallotData(ballot: Ballot, votes: BallotVote[]): BallotData {
        const options = ballot.optionsArray.map((option, index) => {
            const votesForThisOption = votes.filter(vote => vote.optionIndex === index)
            const dragonGoldSum = votesForThisOption.reduce((sum, vote) => sum + parseInt(vote.dragonGold), 0)
            const description = ballot.descriptionArray[index]
            return { title: option, description, lockedInDragonGold: dragonGoldSum.toString() }
        })
  
        return { id: ballot.ballotId, status: ballot.state, inquiry: ballot.inquiry, inquiryDescription: ballot.description, url: ballot.url, options}
    }

    static processSingleBallot(ballot: Ballot, votes: BallotVote[]): StoredBallot {
        const options = ballot.optionsArray.map((option, index) => {
            const votesForThisOption = votes.filter(vote => vote.optionIndex === index)
            const dragonGoldSum = votesForThisOption.reduce((sum, vote) => sum + parseInt(vote.dragonGold), 0)
            const description = ballot.descriptionArray[index]
            return { option, description, dragonGold: dragonGoldSum.toString() }
        })
  
        return { id: ballot.ballotId, inquiry: ballot.inquiry, descriptionOfInquiry: ballot.description ,options, state: ballot.state, url: ballot.url }
    }

    static getMaxDragonGold(options: BallotOption[]) {
        return options.reduce((max, option) => BigInt(option.lockedInDragonGold) > BigInt(max) ? option.lockedInDragonGold : max, "0")
    }

    static async close(ballotId: string): Promise<CloseBallotResponse> {
        const ballot = await Ballot.findByPk(ballotId)
        if (!ballot) return {ctype: "error", reason: "unknown Ballot ID"}
        ballot.state = "closed"
        await ballot.save()
        const votes = await BallotVote.findAll({where: { ballotId: ballot.ballotId }})

        const proccedBallot = Ballots.processSingleBallot(ballot, votes)
        
        const maxDragonGold = proccedBallot.options.reduce((max, option) => BigInt(option.dragonGold) > BigInt(max)? option.dragonGold : max, "0")
        const winners = proccedBallot.options.filter(option => option.dragonGold === maxDragonGold)

        return { ctype: "success", inquiry: ballot.inquiry, winners }
    }

    static async vote(ballotId: string, optionIndex: number, userId: string, dragonGold: string): Promise<VoteResponse>{
        try {
            const ballot = await Ballot.findByPk(ballotId)
            if (!ballot) return {ctype: "error", reason: "unknown Ballot ID"}
            if(ballot.state !== "open") return {ctype: "error", reason: "Ballot is no longer accepting votes"}
            const exisitingVote = await BallotVote.findOne({where: {ballotId, userId}})
            if (exisitingVote) return {ctype: "error", reason: "User already voted for this Ballot"}
            const vote = BallotVote.create({userId, ballotId, optionIndex, dragonGold})
            return {ctype: "success"}
        }catch(error: any){
            console.error(error)
            return {ctype: "error", reason: error.message}
        }
    }

    static formatVotes(ballot: Ballot, votes: BallotVote[]): BallotVotesResponse {
        const options = ballot.optionsArray.map((option, index) => {
            const votesForThisOption = votes.filter(vote => vote.optionIndex === index)
            votesForThisOption.sort((a: BallotVote, b: BallotVote) => {
                const dragonGoldA = parseFloat(a.dragonGold)
                const dragonGoldB = parseFloat(b.dragonGold)
                return dragonGoldB - dragonGoldA
              })
            const relevantVoteInfo = votesForThisOption.map((vote) => {return {userId: vote.userId, dragonGold: vote.dragonGold}})
            return { option, votes: relevantVoteInfo }
        })
        return options
    }
}