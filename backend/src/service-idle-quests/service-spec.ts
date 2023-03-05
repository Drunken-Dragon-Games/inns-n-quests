import { LoggingContext } from "../tools-tracing"
import * as models from "./models"
import * as vm from "./game-vm"

export interface IdleQuestsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<HealthStatus>

    getInventory(userId: string): Promise<GetInventoryResult>



    getAvailableEncounters(location: string): Promise<GetAvailableEncountersResult>

    acceptEncounter(userId: string, encounterId: string, adventurerIds: string[]): Promise<AcceptEncounterResult>

    getActiveEncounters(userId: string): Promise<GetActiveEncountersResult>

    claimEncounter(userId: string, activeEncounterId: string): Promise<ClaimEncounterResult>


    getAvailableQuests(location: string): Promise<GetAvailableQuestsResult>

    acceptQuest(userId: string, questId: string, adventurerIds: string[]): Promise<AcceptQuestResult>

    getTakenQuests(userId: string): Promise<GetTakenQuestsResult>

    claimQuestResult(userId: string, takenQuestId: string): Promise<ClaimQuestResult>



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



export type GetAvailableEncountersResult
    = { status: "ok", availableEncounters: models.AvailableEncounter[] }

export type AcceptEncounterResult
    = { status: "ok", activeEncounter: models.ActiveEncounter }
    | { status: "unknown-encounter" }
    | { status: "invalid-adventurers" }

export type GetActiveEncountersResult
    = { status: "ok", activeEncounters: models.ActiveEncounter[] }

export type ClaimEncounterResult
    = { status: "ok", outcome: vm.QuestOutcome }
    | { status: "unknown-encounter" }
    | { status: "already-claimed" }
    | { status: "not-finished" }
    | { status: "missing-adventurers", missing: string[] }



export type AcceptQuestResult
    = { status: "ok", takenQuest: models.TakenQuest }
    | { status: "unknown-quest" }
    | { status: "invalid-adventurers" }

export type GetAvailableQuestsResult
    = { status: "ok", availableQuests: models.AvailableQuest[] }

export type GetTakenQuestsResult
    = { status: "ok", takenQuests: models.TakenQuest[] }

export type ClaimQuestResult
    = { status: "ok", outcome: vm.QuestOutcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }
