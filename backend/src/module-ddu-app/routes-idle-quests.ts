
import { Response, Router } from "express"
import { Request } from "express-jwt"
import { IdleQuestsService } from "../service-idle-quests"
import { isObjectLocations } from "../service-idle-quests/game-vm/sectors/sector-validation"
import { LoggingContext } from "../tools-tracing"
import { requestCatchError } from "./error/catch-error"
import { KiliaBotServiceDsl } from "../service-kilia-bot"

export const idleQuestRoutes = (idleQuestsService: IdleQuestsService, kilia?: KiliaBotServiceDsl) => {
    const router = Router()    
    const baseLogger = LoggingContext.create("idle-quests")

    router.get('/encounter/available', requestCatchError(async (request: Request, response: Response) => {
        const location: string = request.query.location as string
        const result = await idleQuestsService.getAvailableEncounters(location)
        response.status(200).json(result)
    }))

    router.post('/encounter/accept', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const encounterId: string = request.body.encounterId
        const adventurerIds: string[] = request.body.adventurerIds
        const result = await idleQuestsService.acceptEncounter(userId, encounterId, adventurerIds)
        response.status(200).json(result)
    }))

    router.get('/encounter/active', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getActiveEncounters(userId)
        response.status(200).json(result)
    }))

    router.post('/encounter/claim', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const activeEncounterId: string = request.body.activeEncounterId
        const result = await idleQuestsService.claimEncounter(userId, activeEncounterId)
        response.status(200).json(result)
    }))

    router.get('/staking-quest/available', requestCatchError(async (request: Request, response: Response) => {
        const userId = request.auth!.userId
        const result = await idleQuestsService.getAvailableStakingQuests("Auristar", 20)
        response.status(200).send(result)
    }))

    router.post('/staking-quest/accept', requestCatchError(async (request: Request, response: Response) => {
        const questId: string = request.body.questId
        const adventurerIds: string[] = request.body.adventurerIds
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.acceptStakingQuest(userId, questId, adventurerIds)
        response.status(200).send(result)
    }))

    router.get('/staking-quest/taken', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getTakenStakingQuests(userId)
        response.status(200).json(result)
    }))

    router.post('/staking-quest/claim', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const takenQuestId: string = request.body.takenQuestId
        const result = await idleQuestsService.claimStakingQuestResult(userId, takenQuestId)
        response.status(200).json(result)
    }))

    router.get('/inventory', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.getInventory(userId)
        response.status(200).json(result)
    }))

    router.get('/grant-test-inventory', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await idleQuestsService.grantTestInventory(userId)
        response.status(200).json(result)
    }))

    router.post('/set-inn-state', requestCatchError(async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const innName = request.body.name
        const objectLocations = request.body.objectLocations
        if (objectLocations && !isObjectLocations(objectLocations)) 
            response.status(400).send("Invalid object locations")
        else if (innName && typeof innName != "string")
            response.status(400).send("Invalid inn name")
        else {
            await idleQuestsService.setInnState(userId, innName, objectLocations)
            response.sendStatus(200)
        }
    }))

    router.use((err: any, request: Request, response: Response, next: any) => {
        const logger = baseLogger.trace(request)
        kilia?.sendErrorMessage(err, request.originalUrl, request.method, logger.traceId, logger.userId)
        logger.error(err.message, { stack: err.stack })
        response.status(500).send("Internal server error.")
    })

    return router
}
