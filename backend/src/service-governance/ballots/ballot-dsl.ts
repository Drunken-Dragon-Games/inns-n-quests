import { RegisterBallotResponse, registerBallot } from "../models"
import { Ballot, BallotVote } from "./ballots-db"

export class Ballots {
    static async register(ballot: registerBallot): Promise<RegisterBallotResponse> {
        try{return {status: "success", ballotId: (await Ballot.create({ inquiry: ballot.inquiry, state: 'open', options: JSON.stringify(ballot.options) })).ballotId}}
        catch(e: any) {return {status: "error", reason: e.message}}
    }
}