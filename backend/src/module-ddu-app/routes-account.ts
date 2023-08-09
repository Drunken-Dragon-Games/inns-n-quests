import { NextFunction, Response, Router } from "express"
import { Request } from "express-jwt"
import jwt from "jsonwebtoken"
import { v4 } from "uuid"
import { AccountService } from "../service-account"
import { AuthenticationResult } from "../service-identity"
import { COOKIE_EXPIRACY, SECRET_KEY } from "./settings"
import { jwtMiddleware } from "./jwt_middleware"
import { ClaimerInfo } from "../service-asset-management"
import { MinimalUTxO } from "../tools-cardano"
import { LoggingContext } from "../tools-tracing"
import { KiliaBotServiceDsl } from "../service-kilia-bot"
import { requestCatchError } from "./error/catch-error"

export const accountRoutes = (accountService: AccountService, kilia?: KiliaBotServiceDsl) => {
    const router = Router()    
    const baseLogger = LoggingContext.create("account")

    router.post("/development/authenticate", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const nickname: string = request.body.nickname
        const result = await accountService.authenticateDevelopment(nickname, logger)
        if (result.status == "ok") {
            response.status(200).json(signJWTAndSetCookie(result, response))
        } else 
            response.status(401).json(result)
    }))

    router.post("/discord/authenticate", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const code: string = request.body.code
        const result = await accountService.authenticateDiscord(code, logger)
        if (result.status == "ok") {
            response.status(200).json(signJWTAndSetCookie(result, response))
        } else 
            response.status(401).json(result)
    }))

    router.post("/session/signout", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const sessionId = request.auth!.sessionId
        const result = await accountService.signout(sessionId, logger)
        response.cookie("access", "", { maxAge: 0, sameSite: "none", secure: true })
        response.status(200).json(result)
    }))

    router.post("/session/refresh", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const fullRefreshToken = request.body.refreshToken
        try {
            const refreshPayload = jwt.verify(fullRefreshToken, SECRET_KEY)
            if (typeof refreshPayload == "string") throw new Error()
            const { sessionId, refreshToken } = refreshPayload
            const result = await accountService.refreshSession(sessionId, refreshToken, logger)
            if (result.status != "ok") throw new Error()
            response.status(200).json(signJWTAndSetCookie(result, response))
        }catch {
            response.cookie("access", "", { maxAge: 0, sameSite: "none", secure: true })
            response.status(401).json({ status: "bad-credentials" })
        }
    }))

    router.post("/association/nonce", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const stakeAddress: string = request.body.stakeAddress
        const result = await accountService.getAssociationNonce(stakeAddress, logger)
        response.status(200).json(result)
    }))

    router.post("/association/signature", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const nonce = request.body.nonce
        const { key, signature } = request.body.signedMessage
        const result = await accountService.submitAssociationSignature(userId, nonce, key, signature, logger)
        response.status(200).json(result)
    }))

    router.post("/session/test", requestCatchError(async (request: Request, response: Response) => {
        console.log("REQUEST")
        console.log(request.headers)
        response.cookie("test", v4(), { maxAge: COOKIE_EXPIRACY, sameSite: "none", secure: true })
        console.log("RESPONSE")
        console.log(response.headersSent)
        response.sendStatus(200)
    }))

    router.post("/association/nonce", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const stakeAddress: string = request.body.stakeAddress
        const result = await accountService.getAssociationNonce(stakeAddress, logger)
        response.status(200).json(result)
    }))

    router.post("/association/tx", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const {stakeAddress, address} = request.body
        const result = await accountService.getAssociationTx(userId, stakeAddress, address, logger)
        response.status(200).json(result)
    }))

    router.post("/association/submit-tx", jwtMiddleware,requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const {serializedSignedTx, authStateId} = request.body
        const result = await accountService.submitAssociationTx(userId, serializedSignedTx, authStateId, logger)
        response.status(200).json(result)
    }))

    router.post("/association/clean-assosiate-tx-state", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const {authStateId, error} = request.body
        const result = await accountService.cleanAssociationState(authStateId, error, logger)
        response.status(200).json(result)
    }))

    router.post("/association/deassociate-wallet", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const {stakeAddress} = request.body
        const result = await accountService.deassociateWallet(userId, stakeAddress, logger)
        response.status(200).json(result)
    }))

    router.get("/assets/claim/dragon-silver", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const page: number | undefined = request.body.page
        const result = await accountService.getDragonSilverClaims(userId, page, logger)
        response.status(200).json(result)
    }))

    router.post("/assets/claim/dragon-silver", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const stakeAddress: string = request.body.stakeAddress
        const address: string = request.body.address
        const result = await accountService.claimDragonSilver(userId, stakeAddress, address, logger)
        response.status(200).json(result)
    }))

    router.post("/assets/claim/sign-and-submit", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const {serializedSignedTx, claimId} = request.body
        const result = await accountService.claimSignAndSubbmit(serializedSignedTx, claimId, logger)
        response.status(200).json(result)
    }))

    router.post("/assets/claim/status", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const {claimId} = request.body
        const result = await accountService.claimStatus(claimId, logger)
        response.status(200).json(result)
    }))

    router.get("/assets/inventory", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const result = await accountService.getUserInventory(userId, logger)
        response.status(200).json(result)
    }))

    /* router.post("/assets/collection", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const {filter} = request.body
        const result = await accountService.getUserCollection(userId, filter, logger)
        response.status(200).json(result)
    })) */

    router.post("/assets/collection-with-metadata", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const filter = request.body.filter
        const result = await accountService.getUserDisplayCollection(userId, filter, logger)
        response.status(200).json(result)
    }) )

    router.post("/assets/mortal-collection", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const result = await accountService.getUserMortalCollection(userId,logger)
        response.status(200).json(result)
    }) )

    router.post("/assets/modify-mortal-collection", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const {assetRef, action} = request.body
        const result = await accountService.modifyMortalCollection(userId, assetRef, action, logger)
        response.status(200).json(result)
    }) )

    router.get("/assets/test/grant", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        if (process.env.NODE_ENV !== "development") {response.status(401).json({status: "Not allowed"})}
        else {
            const logger = baseLogger.trace(request)
            const userId: string = request.auth!.userId
            const result = await accountService.grantTest(userId, logger)
            response.status(200).json({status: "ok"})
        }
    }) )

    router.get("/governance/open", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const result = await accountService.getOpenBallots(logger)
        response.status(200).json(result)
    }))

    router.get("/governance/open-for-user", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const result = await accountService.getUserOpenBallots(userId, logger)
        response.status(200).json(result)
    }))

    router.get("/governance/public", requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const result = await accountService.getPublicBallots(logger)
        response.status(200).json(result)
    }))

    router.get("/governance/user", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const result = await accountService.getUserBallots(userId, logger)
        response.status(200).json(result)
    }))

    router.post("/governance/vote", jwtMiddleware, requestCatchError(async (request: Request, response: Response) => {
        const logger = baseLogger.trace(request)
        const userId: string = request.auth!.userId
        const {ballotId, optionIndex} = request.body
        const result = await accountService.voteForBallot(userId, ballotId, optionIndex, logger)
        response.status(200).json(result)
    }))

    router.use((err: any, request: Request, response: Response, next: any) => {
        const logger = baseLogger.trace(request)
        kilia?.sendErrorMessage(err, request.originalUrl, request.method, logger.traceId, logger.userId)
        logger.error(err.message, { stack: err.stack })
        response.status(500).send("Internal server error.")
    })

    return router
}

function signJWTAndSetCookie(result: AuthenticationResult, response: Response): AuthenticationResult {
    if (result.status != "ok") return result
    const {session, refreshToken} = result.tokens
    const cookieToken = jwt.sign(session, SECRET_KEY)
    const fullRefreshToken = jwt.sign({refreshToken, sessionId: session.sessionId}, SECRET_KEY)
    response.cookie("access", cookieToken, { maxAge: COOKIE_EXPIRACY, sameSite: "none", secure: true })
    return {...result, tokens: {session, refreshToken: fullRefreshToken}}
}