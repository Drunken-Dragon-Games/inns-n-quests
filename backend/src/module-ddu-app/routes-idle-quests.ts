
import { Response, Router } from "express"
import { Request } from "express-jwt"
import { IdleQuestsService } from "../service-idle-quests"

export const idleQuestRoutes = (idleQuestsService: IdleQuestsService) => {
    const router = Router();    

    router.get('/adventurers', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getInventory(userId)
        if (result.status == "ok")
            response.status(200).json(result.inventory)
        else 
            response.status(400).send(result.status)
    })

    router.get('/quests', async (request: Request, response: Response) => {
        const userId = request.auth!.userId
        const result = await idleQuestsService.getAvailableQuests("Auristar")
        if (result.status == "ok")
            response.status(200).send(result.quests)
    })

    router.post('/accept', async (request: Request, response: Response) => {
        const questId: string = request.body.quest_id;
        const adventurerIds: string[] = request.body.adventurer_ids;
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.acceptQuest(userId, questId, adventurerIds)
        if (result.status == "ok")
            response.status(201).send(result.takenQuest)
        else
            response.status(400).send(result.status)
    })

    router.get('/taken-quests', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getTakenQuests(userId)
        if (result.status == "ok")
            response.status(200).json(result.quests)
    })

    router.post('/claim', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const takenQuestId: string = request.body.taken_quest_id;
        const result = await idleQuestsService.claimQuestResult(userId, takenQuestId)
        if (result.status == "ok")
            response.status(200).json(result.outcome)
        else
            response.status(400).send(result.status)
    })

    router.get('/grant-test-inventory', async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.grantTestInventory(userId)
        if (result.status == "ok")
            response.status(200).json(result.inventory)
        else
            response.status(400).send(result.status)
    })

    return router
}