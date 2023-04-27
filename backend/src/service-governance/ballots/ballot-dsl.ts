import { BallotState, CloseBallotResponse, GetBallotResponse, MultipleBallots, RegisterBallotResponse, StoredBallot, registerBallotType, voteResponse } from "../models"
import { Ballot, BallotVote } from "./ballots-db"

export class Ballots {
    static async register(ballot: registerBallotType): Promise<RegisterBallotResponse> {
        try{
            const optionTitles: string[] = []
            const optionDescriptions: string[] = []

            for (const option of ballot.options) {
                optionTitles.push(option.title)
                optionDescriptions.push(option.description)
            }
            return {ctype: "success", ballotId: (await Ballot.create({ inquiry: ballot.question.inquiry, description: ballot.question.description, state: 'open', options: JSON.stringify(optionTitles), descriptions: JSON.stringify(optionDescriptions) })).ballotId}
        }   catch(e: any) {return {ctype: "error", reason: e.message}}
    }

    static async getSingle(ballotId: string): Promise<GetBallotResponse>{
        try{
            const unprossedBallot = await Ballot.findByPk(ballotId)
            if (!unprossedBallot) return {ctype: "error", reason: "unknown Ballot ID"}
            const votes = await BallotVote.findAll({where: { ballotId}})
            const processedBallot = Ballots.processSingleBallot(unprossedBallot, votes)
            return {ctype: "succes", ballot: processedBallot}
        } catch(error: any){
            return { ctype: "error", reason: error.message }
        }
        
    }

    static async getMultiple(state?: BallotState): Promise<MultipleBallots> {
        try {

            const ballots = state ? await Ballot.findAll({ where: { state } }) : await Ballot.findAll()
            const storedBallots: { [ballotId: string]: StoredBallot } = {}

            for (const ballot of ballots) {
            const votes = await BallotVote.findAll({where: { ballotId: ballot.ballotId }})
            const processedBallot = Ballots.processSingleBallot(ballot, votes)
            storedBallots[ballot.ballotId] = processedBallot
            }
            return {ctype: "success", ballots: storedBallots}

        } catch (error: any) {
            return { ctype: "error", reason: error.message }
        }
    }

    private static processSingleBallot(ballot: Ballot,votes: BallotVote[] ): StoredBallot {
    
        const options = ballot.optionsArray.map((option, index) => {
            const votesForThisOption = votes.filter(vote => vote.optionIndex === index)
            const dragonGoldSum = votesForThisOption.reduce((sum, vote) => sum + vote.dragonGold, 0)
            const description = ballot.descriptionArray[index]
            return { option, description, dragonGold: dragonGoldSum.toString() }
        })
  
        return { id: ballot.ballotId, inquiry: ballot.inquiry, descriptionOfInquiry: ballot.description ,options, state: ballot.state }
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

    static async vote(ballotId: string, optionIndex: number, userId: string, dragonGold: number): Promise<voteResponse>{
        try {
            const ballot = await Ballot.findByPk(ballotId)
            if (!ballot) return {ctype: "error", reason: "unknown Ballot ID"}
            if(ballot.state !== "open") return {ctype: "error", reason: "Ballot is no longer accepting votes"}
            const exisitingVote = await Ballot.findOne({where: {ballotId, userId}})
            if (exisitingVote) return {ctype: "error", reason: "User already voted for this Ballot"}
            const vote = BallotVote.create({userId, ballotId, optionIndex, dragonGold})
            return {ctype: "success"}
        }catch(error: any){
            console.error(error)
            return {ctype: "error", reason: error.message}
        }
        
 
    }
}