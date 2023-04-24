import { BallotState, MultipleBallots, RegisterBallotResponse, StoredBallot, registerBallot } from "../models"
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

    static async processBallots(ballots: Ballot[]): Promise<MultipleBallots> {
        try {
          const storedBallots: { [ballotId: string]: StoredBallot } = {}
      
          for (const ballot of ballots) {
            //first i get all the votes of the ballot
            const votes = await BallotVote.findAll({where: { ballotId: ballot.ballotId }})
            
            //array of options with their dragonGold total
            const options = ballot.optionsArray.map((option, index) => {
                //now we get the votes of just this funciton
                const optionVotes = votes.filter(vote => vote.optionIndex === index)
                //for those votes we add all the dragonGold
                const dragonGoldSum = optionVotes.reduce((sum, vote) => sum + vote.dragonGold, 0)
            
                return { option, dragonGold: dragonGoldSum.toString() }
            })
      
            storedBallots[ballot.ballotId] = { inquiry: ballot.inquiry, options, state: ballot.state }
          }
      
          return storedBallots;
        } catch (error: any) {
          return { ctype: "error", reason: error.message };
        }
      }
}