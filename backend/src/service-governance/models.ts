//type repeted in kilia service
export interface registerBallot {
    inquiry: string
    options: string[]
  }

export type BallotState = "open"|"closed" | "archived"

export type StoredBallot = {inquiry: string, options: {option: string, dragonGold: string}[], state: BallotState}

export type RegisterBallotResponse = 
  { ctype: "success", ballotId: string} |
  { ctype: "error", reason: string}

export type MultipleBallots =
  {ctype: "success", ballots: {[ballotId: string]: StoredBallot}}|
  {ctype: "error", reason: string}

export type GetBallotResponse = 
  {ctype: "succes", ballot: StoredBallot}|
  {ctype: "error", reason: string}

export type CloseBallotResponse = 
{ctype: "success", inquiry: string, winners: {option: string, dragonGold: string}[]} |
{ctype: "error", reason: string}