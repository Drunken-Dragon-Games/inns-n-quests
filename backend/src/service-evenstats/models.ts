import { Adventurer, TakenQuest } from "../service-idle-quests"

export type EvenstatEvent = EvenstatClaimedQuest

export type EvenstatClaimedQuest = {
    ctype: "evenstat-claimed-quest",
    quest: TakenQuest,
    adventurers: Adventurer[], 
}

export interface EvenstatSubscriber {
    onEvenstatEvent: (event: EvenstatEvent) => Promise<void>
}