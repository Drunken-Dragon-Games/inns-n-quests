//type repeted in kilia service
export interface registerBallot {
    inquiry: string
    options: string[]
  }

export type RegisterBallotResponse = 
  { status: "success", ballotId: string} |
  { status: "error", reason: string}
