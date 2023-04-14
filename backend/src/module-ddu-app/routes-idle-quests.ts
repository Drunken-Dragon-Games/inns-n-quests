
import { Response, Router } from "express"
import { Request } from "express-jwt"
import { IdleQuestsService } from "../service-idle-quests/index.js"
import { isObjectLocations } from "../service-idle-quests/game-vm/sectors/sector-validation.js"

export const idleQuestRoutes = (idleQuestsService: IdleQuestsService) => {
    const router = Router()    

    router.get('/encounter/available', async (request: Request, response: Response) => {
        const location: string = request.query.location as string
        const result = await idleQuestsService.getAvailableEncounters(location)
        response.status(200).json(result)
    })

    router.post('/encounter/accept', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const encounterId: string = request.body.encounterId
        const adventurerIds: string[] = request.body.adventurerIds
        const result = await idleQuestsService.acceptEncounter(userId, encounterId, adventurerIds)
        response.status(200).json(result)
    })

    router.get('/encounter/active', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getActiveEncounters(userId)
        response.status(200).json(result)
    })

    router.post('/encounter/claim', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const activeEncounterId: string = request.body.activeEncounterId
        const result = await idleQuestsService.claimEncounter(userId, activeEncounterId)
        response.status(200).json(result)
    })

    router.get('/staking-quest/available', async (request: Request, response: Response) => {
        const userId = request.auth!.userId
        const result = await idleQuestsService.getAvailableStakingQuests("Auristar")
        response.status(200).send(result)
    })

    router.post('/staking-quest/accept', async (request: Request, response: Response) => {
        const questId: string = request.body.questId
        const adventurerIds: string[] = request.body.adventurerIds
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.acceptStakingQuest(userId, questId, adventurerIds)
        response.status(200).send(result)
    })

    router.get('/staking-quest/taken', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getTakenStakingQuests(userId)
        response.status(200).json(result)
    })

    router.post('/staking-quest/claim', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const takenQuestId: string = request.body.takenQuestId
        const result = await idleQuestsService.claimStakingQuestResult(userId, takenQuestId)
        response.status(200).json(result)
    })

    router.get('/inventory', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getInventory(userId)
        response.status(200).json(result)
    })

    router.get('/grant-test-inventory', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.grantTestInventory(userId)
        response.status(200).json(result)
    })

    router.post('/set-inn-state', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const innName = request.body.name
        const objectLocations = request.body.objectLocations
        if (objectLocations && !isObjectLocations(objectLocations)) 
            return response.status(400).send("Invalid object locations")
        if (innName && typeof innName != "string")
            return response.status(400).send("Invalid inn name")
        await idleQuestsService.setInnState(userId, innName, objectLocations)
        response.sendStatus(200)
    })

    return router
}
