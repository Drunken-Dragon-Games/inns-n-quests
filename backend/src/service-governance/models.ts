//type repeted in kilia service
export interface registerBallot {
  question: string
  options: {title: string, description: string}[]
}
//type repeted in kilia service
//type repeted in account service
export type BallotState = "open"|"closed" | "archived"
//type repeted in kilia service
//type repeted in account service
export type StoredBallot = {inquiry: string, options: {option: string, description: string ,dragonGold: string}[], state: BallotState}

export type RegisterBallotResponse = 
  { ctype: "success", ballotId: string} |
  { ctype: "error", reason: string}
//type repeted in account service
export type MultipleBallots =
  {ctype: "success", ballots: {[ballotId: string]: StoredBallot}}|
  {ctype: "error", reason: string}

export type GetBallotResponse = 
  {ctype: "succes", ballot: StoredBallot}|
  {ctype: "error", reason: string}

export type CloseBallotResponse = 
{ctype: "success", inquiry: string, winners: {option: string, dragonGold: string}[]} |
{ctype: "error", reason: string}

export type voteResponse = 
{ctype: "success"} |
{ctype: "error", reason: string}