import { AxiosError } from "axios"
import { axiosCustomInstance } from "../../../axios/axiosApi"
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
