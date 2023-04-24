//type repeted in kilia service
export interface Ballot {
    question: string
    options: string[]
  }

export type AddBallotResponse = 
  { state: "success", ballotId: string} |
  { state: "error", reason: string}
