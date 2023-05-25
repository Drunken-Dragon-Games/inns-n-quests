//type repeted in governance service
export interface registerBallotType {
    question: {inquiry: string, description: string}
    options: {title: string, description: string}[]
  }
//type repeted in governance service
export type BallotState = "open" | "closed" | "archived"
//type repeted in governance service
export type StoredBallot = {id: string, inquiry: string, descriptionOfInquiry: string, options: {option: string, description: string ,dragonGold: string}[], state: BallotState}
export type ConfirmMessagge = {confirm?: string, cancel: string, timeout: string}

//repeted from govenance service
type BaseOption = {title: string, description: string}
type SensitiveOption = BaseOption & {lockedInDragonGold: string}

export type BaseBallot = {status: BallotState, id: string, inquiry: string ,inquiryDescription: string}
export type AdminBallot = BaseBallot & {options: SensitiveOption[]}