export interface BallotRegistration {
    question: { inquiry: string, description: string }
    options: { title: string, description: string }[]
    url?: string
}

export type StoredBallot = {
    id: string,
    inquiry: string,
    descriptionOfInquiry: string,
    options: {
        option: string,
        description: string,
        dragonGold: string
    }[],
    state: BallotState,
    url?: string
}

export type RegisterBallotResponse =
    { ctype: "success", ballotId: string } |
    { ctype: "error", reason: string }

export type MultipleBallots =
    { ctype: "success", ballots: { [ballotId: string]: StoredBallot } } |
    { ctype: "error", reason: string }

export type GetBallotResponse =
    { ctype: "succes", ballot: StoredBallot } |
    { ctype: "error", reason: string }

export type CloseBallotResponse =
    { ctype: "success", inquiry: string, winners: { option: string, dragonGold: string }[] } |
    { ctype: "error", reason: string }

export type VoteResponse =
    { ctype: "success" } |
    { ctype: "error", reason: string }

export type StoredUserBallot = {
    id: string, inquiry: string,
    descriptionOfInquiry: string,
    options: {
        option: string,
        description: string
    }[],
    voteRegistered: boolean,
    state: BallotState
}

export type MultipleUserBallots =
    { ctype: "success", ballots: { [ballotId: string]: StoredUserBallot } } |
    { ctype: "error", reason: string }

export type BallotState = "open" | "closed" | "archived"
export type BaseOption = { title: string, description: string }
export type VotedOption = BaseOption & { isVotedByUser: boolean }
export type SensitiveOption = BaseOption & { lockedInDragonGold: string }
export type ClosedOption = SensitiveOption & { isWinner: boolean }
export type UserClosedOption = ClosedOption & { isVotedByUser: boolean }

export type BaseBallot = { status: BallotState, id: string, inquiry: string, inquiryDescription: string, url?: string }

export type OpenPublicBallot = BaseBallot & { status: "open", options: BaseOption[] }
export type ClosedPublicBallot = BaseBallot & { status: "closed", options: ClosedOption[] }

export type OpenUserBallot = BaseBallot & { status: "open", hasVoted: boolean, options: VotedOption[] }
export type ClosedUserBallot = BaseBallot & { status: "closed", hasVoted: boolean, options: UserClosedOption[] }
export type AdminBallot = BaseBallot & { options: SensitiveOption[] }
export type PublicBallot = OpenPublicBallot | ClosedPublicBallot
export type UserBallot = OpenUserBallot | ClosedUserBallot

export type AdminBallotCollection =
    { ctype: "success", ballots: { [ballotId: string]: AdminBallot } } |
    { ctype: "error", reason: string }

export type PublicBallotCollection =
    { ctype: "success", ballots: { [ballotId: string]: PublicBallot } } |
    { ctype: "error", reason: string }

export type UserBallotCollection =
    { ctype: "success", ballots: { [ballotId: string]: UserBallot } } |
    { ctype: "error", reason: string }

export type BallotOption = { title: string, description: string, lockedInDragonGold: string }

export type BallotData = {
    id: string
    status: BallotState,
    inquiry: string,
    inquiryDescription: string
    options: BallotOption[]
    url?: string
}

export type AllBallotData =
    { ctype: "success", ballots: { [ballotId: string]: BallotData } } |
    { ctype: "error", reason: string }

