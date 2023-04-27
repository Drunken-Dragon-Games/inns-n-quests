//type repeted in kilia service
export interface registerBallotType {
  question: {inquiry: string, description: string}
  options: {title: string, description: string}[]
}

//type repeted in kilia service
//type repeted in account service
//type repeted in frontend accoundSL
export type BallotState = "open"|"closed" | "archived"
export type StoredBallot = {id: string, inquiry: string, descriptionOfInquiry: string, options: {option: string, description: string ,dragonGold: string}[], state: BallotState}

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