import router from "next/router"
import axios, { AxiosError, AxiosResponse, Method } from "axios"
import urljoin from "url-join"
import { v4 } from "uuid"
import { 
    AcceptEncounterResult, AcceptStakingQuestResult, AvailableStakingQuest, Character, ClaimEncounterResult, 
    ClaimStakingQuestResult, GetActiveEncountersResult, GetAvailableEncountersResult, GetAvailableStakingQuestsResult, GetInventoryResult, 
    GetTakenStakingQuestsResult, 
    hydrateTakenQuests, 
    TakenStakingQuest 
} from "./common"
import InventoryApi from "./modules/inventory/inventory-api"
import { NotificationsApi } from "./modules/notifications"

const IdleQuestsApi = {

    async getAvailableEncounters(location: string): Promise<GetAvailableEncountersResult> {
        const response = await IdleQuestsRequestWRefresh("get", "/encounter/available", {location})
        return response.data
    },

    async acceptEncounter(userId: string, encounterId: string, adventurerIds: string[]): Promise<AcceptEncounterResult> {
        const response = await IdleQuestsRequestWRefresh("post", "/encounter/accept", {userId, encounterId, adventurerIds})
        return response.data
    },

    async getActiveEncounters(userId: string): Promise<GetActiveEncountersResult> {
        const response = await IdleQuestsRequestWRefresh("get", "/encounter/active", {userId})
        return response.data
    },

    async claimEncounter(userId: string, activeEncounterId: string): Promise<ClaimEncounterResult> {
        const response = await IdleQuestsRequestWRefresh("post", "/encounter/claim", {userId, activeEncounterId})
        return response.data
    },

    async getAvailableStakingQuests(): Promise<GetAvailableStakingQuestsResult> {
        const response = await IdleQuestsRequestWRefresh("get", "/staking-quest/available")
        return response.data
    },

    async takeAvailableStakingQuest(quest: AvailableStakingQuest, party: Character[]): Promise<AcceptStakingQuestResult> {
        const adventurerIds = party.map(adventurer => adventurer.entityId)
        const response = await IdleQuestsRequestWRefresh("post", "/staking-quest/accept", {questId: quest.questId, adventurerIds})
        if (response.data.status === "ok") {
            const takenQuest = hydrateTakenQuests(InventoryApi.getCharacters())(response.data.takenQuest)
            if (takenQuest.ctype === "missing-adventurers") {
                NotificationsApi.notify("Something went wrong, please contact us and describe the issue.", "alert")
                return { status: "invalid-adventurers" }
            } else 
                return { status: "ok", takenQuest: takenQuest.quest }
        } else
            return response.data
    },

    async getInProgressStakingQuests(): Promise<GetTakenStakingQuestsResult> {
        const response = await IdleQuestsRequestWRefresh("get", "/staking-quest/taken")
        if (response.data.status === "ok") {
            const hydratedTakenQuests = (response.data.takenQuests as TakenStakingQuest[]).map(hydrateTakenQuests(InventoryApi.getCharacters()))
            const questsWithMissingAdventurers = hydratedTakenQuests
                .filter(takenQuest => takenQuest.ctype === "missing-adventurers")
            const takenQuests = hydratedTakenQuests
                .filter(takenQuest => takenQuest.ctype === "valid-quest").map(q => q.quest)
            questsWithMissingAdventurers.forEach(takenQuest => 
                NotificationsApi.notify(`Quest failed because adventurers were transfered early: ${takenQuest.quest.availableQuest.name}`, "info"))
            return { status: "ok", takenQuests: takenQuests }
        } else
            return response.data
    },

    async claimTakenStakingQuest(quest: TakenStakingQuest): Promise<ClaimStakingQuestResult> {
        const response = await IdleQuestsRequestWRefresh("post", "/staking-quest/claim", {takenQuestId: quest.takenQuestId})
        return response.data
    },

    async getInventory(): Promise<GetInventoryResult> {
        const response = await IdleQuestsRequestWRefresh("get", "/inventory")
        return response.data
    },

    async grantTestInventory(): Promise<GetInventoryResult> {
        const response = await IdleQuestsRequestWRefresh("get", "/grant-test-inventory")
        return response.data
    },

    async setInnState(state: { name?: string, objectLocations?: Record<string, [number, number]>}): Promise<void> {
        await IdleQuestsRequestWRefresh("post", "/set-inn-state", state)
    },
}

export default IdleQuestsApi

async function IdleQuestsRequestWRefresh<ReqData = any, ResData = any>(method: Method, endpoint: string, data?: ReqData): Promise<AxiosResponse<ResData>> {
    return await withTokenRefresh(() => IdleQuestsRequest(method, endpoint, data))
}

async function IdleQuestsRequest<ReqData = any, ResData = any>(method: Method, endpoint: string, data?: ReqData): Promise<AxiosResponse<ResData>> {
    const traceId = v4()
    const baseURL = urljoin(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:5000", "quests/api")
    //if (baseURL.includes("acceptance.") || baseURL.includes("testnet.") || baseURL.includes("localhost")) 
        console.log(`${method}: ${endpoint}\ntrace-id: ${traceId}`)
    return await axios.request<ResData, AxiosResponse<ResData>, ReqData>({
        method,
        baseURL,
        url: endpoint,
        data,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "Trace-ID": traceId
        },
        timeout: 5000,
        withCredentials: true,
    })
}

async function withTokenRefresh<T>(fn: () => Promise<T>): Promise<T> {
    try { return await fn() }
    catch (err) { 
        if (await refreshToken(err)) return await fn()
        else throw err 
    }
}

async function refreshToken(error: any): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh")
    if(error instanceof AxiosError && error.response?.status == 401 && refreshToken){
        try {
            const response = await IdleQuestsRequest('post', '/api/refreshSession/', { "fullRefreshToken": refreshToken })
            localStorage.setItem("refresh", response.data.refreshToken)
            return true
        }
        catch (err) { 
            localStorage.removeItem("refresh")
            router.push("/login")
            return false 
        }
    } else {
        router.push("/login")
        return false
    }
}
