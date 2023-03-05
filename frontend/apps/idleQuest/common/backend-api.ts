import { AxiosError } from "axios"
import { axiosCustomInstance } from "../../../axios/axiosApi"
import * as vm from "../game-vm"

export type Character 
    = vm.CharacterEntity
    & vm.WithTag<"character">
    & vm.WithOwner 
    & vm.WithSprite 
    & vm.WithActivityState
    & vm.WithSkills
    & vm.WithEV

export type Furniture
    = vm.FurnitureEntity
    & vm.WithTag<"furniture">
    & vm.WithOwner
    & vm.WithSprite

export type AvailableQuest
    = vm.AvailableQuest
    & vm.WithTag<"available-quest">

export type TakenQuest 
    = vm.TakenQuest
    & vm.WithTag<"taken-quest">
    & vm.WithOwner

export type AvailableEncounter
    = vm.Encounter
    & vm.WithTag<"available-encounter">

export type ActiveEncounter
    = vm.ActiveEncounter
    & vm.WithTag<"active-encounter">
    & vm.WithOwner

export type Sector 
    = vm.Sector
    & vm.WithTag<"sector">

export type IdleQuestsInventory = {
    characters: Record<string, Character> 
    furniture: Record<string, Furniture>
    innState?: Sector
}



export type GetInventoryResult 
    = { status: "ok", inventory: IdleQuestsInventory }
    | { status: "unknown-user" }

export type GetAvailableEncountersResult
    = { status: "ok", availableEncounters: AvailableEncounter[] }

export type AcceptEncounterResult
    = { status: "ok", activeEncounter: ActiveEncounter }
    | { status: "unknown-encounter" }
    | { status: "invalid-adventurers" }

export type GetActiveEncountersResult
    = { status: "ok", activeEncounters: ActiveEncounter[] }

export type ClaimEncounterResult
    = { status: "ok", outcome: vm.QuestOutcome }
    | { status: "unknown-encounter" }
    | { status: "already-claimed" }
    | { status: "not-finished" }
    | { status: "missing-adventurers", missing: string[] }

export type AcceptQuestResult
    = { status: "ok", takenQuest: TakenQuest }
    | { status: "unknown-quest" }
    | { status: "invalid-adventurers" }

export type GetAvailableQuestsResult
    = { status: "ok", availableQuests: AvailableQuest[] }

export type GetTakenQuestsResult
    = { status: "ok", takenQuests: TakenQuest[] }

export type ClaimQuestResult
    = { status: "ok", outcome: vm.QuestOutcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }

export const withTokenRefresh = async (fn: () => Promise<void>): Promise<void> => {
    try { await fn() }
    catch (err) { 
        if (await refreshToken(err)) return await fn()
        else throw err 
    }
}

async function refreshToken(error: any): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh");
    if(error instanceof AxiosError && error.response?.status == 401 && refreshToken){
        try {
            const response = await axiosCustomInstance('/api/refreshSession/').post('/api/refreshSession/', { "fullRefreshToken": refreshToken })
            localStorage.setItem("refresh", response.data.refreshToken)
            return true
        }
        catch (err) { 
            return false 
        }
    } else 
        return false
}
