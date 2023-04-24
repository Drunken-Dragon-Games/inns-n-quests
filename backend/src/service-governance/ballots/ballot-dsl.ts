import { RegisterBallotResponse, registerBallot } from "../models"
import { Ballot, BallotVote } from "./ballots-db"

export class Ballots {
    static async register(ballot: registerBallot): Promise<RegisterBallotResponse> {
        try{return {ctype: "success", ballotId: (await Ballot.create({ inquiry: ballot.inquiry, state: 'open', options: JSON.stringify(ballot.options) })).ballotId}}
        catch(e: any) {return {ctype: "error", reason: e.message}}
    }
}