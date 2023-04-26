//type repeted in governance service
export interface registerBallotType {
    question: string
    options: {title: string, description: string}[]
  }
//type repeted in governance service
export type BallotState = "open" | "closed" | "archived"
//type repeted in governance service
export type StoredBallot = {inquiry: string, options: {option: string, description: string ,dragonGold: string}[], state: BallotState}
export type ConfirmMessagge = {confirm?: string, cancel: string, timeout: string}

