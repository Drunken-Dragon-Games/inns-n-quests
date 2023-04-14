import { LoggingContext } from "../tools-tracing.js"
import * as models from "./models.js"
import * as vm from "./game-vm.js"

export interface IdleQuestsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<HealthStatus>

    /** Encounters */

    getAvailableEncounters(location: string): Promise<GetAvailableEncountersResult>

    acceptEncounter(userId: string, encounterId: string, adventurerIds: string[]): Promise<AcceptEncounterResult>

    getActiveEncounters(userId: string): Promise<GetActiveEncountersResult>

    claimEncounter(userId: string, activeEncounterId: string): Promise<ClaimEncounterResult>

    /** Staking Quests */

    getAvailableStakingQuests(location: string): Promise<GetAvailableStakingQuestsResult>

    acceptStakingQuest(userId: string, questId: string, adventurerIds: string[]): Promise<AcceptStakingQuestResult>

    getTakenStakingQuests(userId: string): Promise<GetTakenStakingQuestsResult>

    claimStakingQuestResult(userId: string, takenQuestId: string): Promise<ClaimStakingQuestResult>

    /** Player State */

    getInventory(userId: string): Promise<GetInventoryResult>

    grantTestInventory(userId: string): Promise<GetInventoryResult>

    setInnState(userId: string, name?: string, objectLocations?: vm.ObjectsLocations): Promise<void>
}

export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export type GetInventoryResult 
    = { status: "ok", inventory: models.IdleQuestsInventory }
    | { status: "unknown-user" }

/** Encounters */

export type GetAvailableEncountersResult
    = { status: "ok", availableEncounters: models.AvailableEncounter[] }

export type AcceptEncounterResult
    = { status: "ok", activeEncounter: models.ActiveEncounter }
    | { status: "unknown-encounter" }
    | { status: "invalid-adventurers" }

export type GetActiveEncountersResult
    = { status: "ok", activeEncounters: models.ActiveEncounter[] }

export type ClaimEncounterResult
    = { status: "ok", outcome: vm.EncounterOutcome }
    | { status: "unknown-encounter" }
    | { status: "already-claimed" }
    | { status: "not-finished" }
    | { status: "missing-adventurers", missing: string[] }

/** Staking Quests */

export type GetAvailableStakingQuestsResult
    = { status: "ok", availableQuests: models.AvailableStakingQuest[] }

export type AcceptStakingQuestResult
    = { status: "ok", takenQuest: models.TakenStakingQuest }
    | { status: "unknown-quest" }
    | { status: "invalid-adventurers" }

export type GetTakenStakingQuestsResult
    = { status: "ok", takenQuests: models.TakenStakingQuest[] }

export type ClaimStakingQuestResult
    = { status: "ok", outcome: vm.StakingQuestOutcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }
