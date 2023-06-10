import { LoggingContext } from "../tools-tracing"
import * as models from "./models"
import * as vm from "./game-vm"

export interface IdleQuestsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<HealthStatus>

    /** Encounters */

    getAvailableEncounters(location: string, logger?: LoggingContext): Promise<GetAvailableEncountersResult>

    acceptEncounter(userId: string, encounterId: string, adventurerIds: string[], logger?: LoggingContext): Promise<AcceptEncounterResult>

    getActiveEncounters(userId: string, logger?: LoggingContext): Promise<GetActiveEncountersResult>

    claimEncounter(userId: string, activeEncounterId: string, logger?: LoggingContext): Promise<ClaimEncounterResult>

    /** Staking Quests */

    getAvailableStakingQuests(location: string, quantity: number, logger?: LoggingContext): Promise<GetAvailableStakingQuestsResult>

    acceptStakingQuest(userId: string, questId: string, adventurerIds: string[], logger?: LoggingContext): Promise<AcceptStakingQuestResult>

    getTakenStakingQuests(userId: string, logger?: LoggingContext): Promise<GetTakenStakingQuestsResult>

    claimStakingQuestResult(userId: string, takenQuestId: string, logger?: LoggingContext): Promise<ClaimStakingQuestResult>

    /** Player State */

    getInventory(userId: string, logger?: LoggingContext): Promise<GetInventoryResult>

    grantTestInventory(userId: string, logger?: LoggingContext): Promise<GetInventoryResult>
    
    setSingleAssetActivity(userId: string, assetRef: string, activity: boolean, logger?: LoggingContext): Promise<{status: "ok"} | {status: "failed", reason: string}>

    setInnState(userId: string, name?: string, objectLocations?: vm.ObjectsLocations, logger?: LoggingContext): Promise<void>
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
