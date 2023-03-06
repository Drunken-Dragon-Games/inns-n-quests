import axios, { AxiosError, AxiosResponse, Method } from "axios"
import urljoin from "url-join"
import { v4 } from "uuid"
import { AcceptEncounterResult, AcceptQuestResult, AvailableQuest, Character, ClaimEncounterResult, ClaimQuestResult, GetActiveEncountersResult, GetAvailableEncountersResult, GetAvailableQuestsResult, GetInventoryResult, GetTakenQuestsResult, IdleQuestsInventory, TakenQuest } from "./common"

const IdleQuestsApi = {

    getInventory: async (): Promise<GetInventoryResult> => {
        const response = await IdleQuestsRequest("get", "/inventory")
        if (response.data.status == "ok") {
            const adventurersRecord = response.data.inventory.adventurers
            const furnitureRecord = response.data.inventory.furniture
            return { status: "ok", inventory: response.data.inventory as IdleQuestsInventory}
        } else
            return response.data
    },

    /*
    router.get('/available-encounters', async (request: Request, response: Response) => {
        const location: string = request.query.location as string
        const result = await idleQuestsService.getAvailableEncounters(location)
        response.status(200).json(result)
    })

    router.post('/accept-encounter', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const encounterId: string = request.body.encounter_id
        const adventurerIds: string[] = request.body.adventurer_ids
        const result = await idleQuestsService.acceptEncounter(userId, encounterId, adventurerIds)
        response.status(200).json(result)
    })

    router.get('/active-encounters', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getActiveEncounters(userId)
        response.status(200).json(result)
    })

    router.post('/claim-encounter', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const activeEncounterId: string = request.body.active_encounter_id
        const result = await idleQuestsService.claimEncounter(userId, activeEncounterId)
        response.status(200).json(result)
    })
    */


    async getAvailableEncounters(location: string): Promise<GetAvailableEncountersResult> {
        const response = await IdleQuestsRequest("get", "/encounter/available", {location})
        return response.data
    },

    async acceptEncounter(userId: string, encounterId: string, adventurerIds: string[]): Promise<AcceptEncounterResult> {
        const response = await IdleQuestsRequest("post", "/encounter/accept", {userId, encounterId, adventurerIds})
        return response.data
    },

    async getActiveEncounters(userId: string): Promise<GetActiveEncountersResult> {
        const response = await IdleQuestsRequest("get", "/encounter/active", {userId})
        return response.data
    },

    async claimEncounter(userId: string, activeEncounterId: string): Promise<ClaimEncounterResult> {
        const response = await IdleQuestsRequest("post", "/encounter/claim", {userId, activeEncounterId})
        return response.data
    },




    takeAvailableQuest: async (quest: AvailableQuest, party: Character[]): Promise<AcceptQuestResult> => {
        const adventurer_ids = party.map(adventurer => adventurer.entityId)
        const response = await IdleQuestsRequest("post", "/accept", {quest_id: quest.questId, adventurer_ids})
        if (response.data.status == "ok") 
            return { status: "ok", takenQuest: response.data.takenQuest }
        else
            return response.data
    },

    getInProgressQuests: async (): Promise<GetTakenQuestsResult> => {
        const response = await IdleQuestsRequest("get", "/taken-quests")
        if (response.data.status == "ok") 
            return { status: "ok", takenQuests: response.data.takenQuests }
        else
            return response.data
    },

    claimTakenQuest: async (quest: TakenQuest): Promise<ClaimQuestResult> => {
        const response = await IdleQuestsRequest("post", "/claim", {taken_quest_id: quest.takenQuestId})
        if (response.data.status == "ok")
            return { status: "ok", outcome: response.data.outcome }
        else
            return response.data
    },

    getAvailableQuests: async (): Promise<GetAvailableQuestsResult> => {
        const response = await IdleQuestsRequest("get", "/quests")
        if (response.data.status == "ok") 
            return { status: "ok", availableQuests: response.data.availableQuests }
        else
            return response.data
    },

    grantTestInventory: async (): Promise<GetInventoryResult> => {
        const response = await IdleQuestsRequest("get", "/grant-test-inventory")
        if (response.data.status == "ok") {
            return { status: "ok", inventory: response.data.inventory }
        } else
            return response.data
    },

    setInnState: async (state: { name?: string, objectLocations?: Record<string, [number, number]>}): Promise<void> => {
        await IdleQuestsRequest("post", "/set-inn-state", state)
    },
}

export default IdleQuestsApi

async function IdleQuestsRequest<ReqData = any, ResData = any>(method: Method, endpoint: string, data?: ReqData): Promise<AxiosResponse<ResData>> {
    const traceId = v4()
    const baseURL = urljoin(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:5000", "quests/api")
    //if (baseURL.includes("acceptance.") || baseURL.includes("testnet.") || baseURL.includes("localhost")) 
        console.log(`${method}: ${endpoint}\ntrace-id: ${traceId}`)
    return await withTokenRefresh(() => axios.request<ResData, AxiosResponse<ResData>, ReqData>({
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
    }))
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
            return false 
        }
    } else 
        return false
}
