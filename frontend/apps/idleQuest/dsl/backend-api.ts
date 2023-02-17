import { Adventurer } from "./adventurer"
import { TakenQuest, AvailableQuest, Outcome } from "./quest"

export type GetAllAdventurersResult 
    = { status: "ok", adventurers: Adventurer[] }
    | { status: "unknown-user" }

export type AcceptQuestResult
    = { status: "ok", takenQuest: TakenQuest }
    | { status: "unknown-quest" }
    | { status: "invalid-adventurers" }

export type GetAvailableQuestsResult
    = { status: "ok", quests: AvailableQuest[] }

export type GetTakenQuestsResult
    = { status: "ok", quests: TakenQuest[] }

export type ClaimQuestResult
    = { status: "ok", outcome: Outcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }
