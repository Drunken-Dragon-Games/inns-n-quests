import { BallotState, CloseBallotResponse, GetBallotResponse, MultipleBallots, RegisterBallotResponse, StoredBallot, registerBallot } from "../models"
import { Ballot, BallotVote } from "./ballots-db"

export class Ballots {
    static async register(ballot: registerBallot): Promise<RegisterBallotResponse> {
        try{return {ctype: "success", ballotId: (await Ballot.create({ inquiry: ballot.inquiry, state: 'open', options: JSON.stringify(ballot.options) })).ballotId}}
        catch(e: any) {return {ctype: "error", reason: e.message}}
    }

    static async getBallots(state?: BallotState): Promise<Ballot[]> {
        if(state) return await Ballot.findAll({ where: { state } })
        else return await Ballot.findAll();
    }

    static async getProcessedBallot(ballotId: string): Promise<GetBallotResponse>{
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

    static async processBallots(ballots: Ballot[]): Promise<MultipleBallots> {
        try {
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

    static processSingleBallot(ballot: Ballot,votes: BallotVote[] ): StoredBallot {
    
        const options = ballot.optionsArray.map((option, index) => {
            const votesForThisOption = votes.filter(vote => vote.optionIndex === index)
            const dragonGoldSum = votesForThisOption.reduce((sum, vote) => sum + vote.dragonGold, 0)
            return { option, dragonGold: dragonGoldSum.toString() }
        })
  
        return { inquiry: ballot.inquiry, options, state: ballot.state }
    }

    static async closeBallot(ballotId: string): Promise<CloseBallotResponse> {
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
}