
import { Response, Router } from "express"
import { Request } from "express-jwt"
import { IdleQuestsService } from "../service-idle-quests"
import { isObjectLocations } from "../service-idle-quests/game-vm/sectors/sector-validation";

export const idleQuestRoutes = (idleQuestsService: IdleQuestsService) => {
    const router = Router();    

    router.get('/inventory', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getInventory(userId)
        response.status(200).json(result)
    })

    router.get('/quests', async (request: Request, response: Response) => {
        const userId = request.auth!.userId
        const result = await idleQuestsService.getAvailableQuests("Auristar")
        response.status(200).send(result)
    })

    router.post('/accept', async (request: Request, response: Response) => {
        const questId: string = request.body.quest_id;
        const adventurerIds: string[] = request.body.adventurer_ids;
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.acceptQuest(userId, questId, adventurerIds)
        response.status(200).send(result)
    })

    router.get('/taken-quests', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getTakenQuests(userId)
        response.status(200).json(result)
    })

    router.post('/claim', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const takenQuestId: string = request.body.taken_quest_id;
        const result = await idleQuestsService.claimQuestResult(userId, takenQuestId)
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