import { Character, TakenStakingQuest } from "../service-idle-quests/index.js"

export interface EvenstatsSubscriber {
    onEvenstatsEvent: (event: EvenstatsEvent) => Promise<void>
}

export type EvenstatsEvent = ClaimedQuestEvent | QuestsSucceededLeaderboardChangedEvent

export type ClaimedQuestEvent = {
    ctype: "claimed-quest-event",
    quest: TakenStakingQuest,
    adventurers: Character[], 
}

export type QuestsSucceededLeaderboardChangedEvent = {
    ctype: "quests-succeeded-leaderboard-changed-event",
    leaderboard: QuestSucceededEntry[],
}

export type Leaderboard = {
    questsSucceeded: QuestSucceededEntry[],
}

export type QuestSucceededEntry = {
    userId: string,
    count: number,
}
