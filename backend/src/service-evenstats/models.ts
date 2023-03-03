import { Character, TakenQuest } from "../service-idle-quests"

export interface EvenstatsSubscriber {
    onEvenstatsEvent: (event: EvenstatsEvent) => Promise<void>
}

export type EvenstatsEvent = ClaimedQuestEvent | QuestsSucceededLeaderboardChangedEvent

export type ClaimedQuestEvent = {
    ctype: "claimed-quest-event",
    quest: TakenQuest,
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
