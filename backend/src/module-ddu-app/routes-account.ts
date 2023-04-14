import { Response, Router } from "express"
import { Request } from "express-jwt"
import jwt from "jsonwebtoken"
import { v4 } from "uuid"
import { AccountService } from "../service-account/index.js"
import { AuthenticationResult } from "../service-identity/index.js"
import { COOKIE_EXPIRACY, SECRET_KEY } from "./settings.js"
import { AuthRequest } from "./types.js"
import { jwtMiddleware } from "./middleware/jwt_middleware.js"

export const accountRoutes = (accountService: AccountService) => {
    const router = Router()    

    router.post("/development/authenticate", async (request: Request, response: Response) => {
        const nickname: string = request.body.nickname
        const result = await accountService.authenticateDevelopment(nickname)
        if (result.status == "ok") {
            return response.status(200).json(signJWTAndSetCookie(result, response))
        } else 
            return response.status(401).json(result)
    })

    router.post("/discord/authenticate", async (request: Request, response: Response) => {
        const code: string = request.body.code
        const result = await accountService.authenticateDiscord(code)
        if (result.status == "ok") {
            return response.status(200).json(signJWTAndSetCookie(result, response))
        } else 
            return response.status(401).json(result)
    })

    router.post("/session/signout", jwtMiddleware, async (request: Request, response: Response) => {
        const sessionId = request.auth!.sessionId
        const result = await accountService.signout(sessionId)
        response.cookie("access", "", { maxAge: 0, sameSite: "none", secure: true })
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.post("/session/refresh", async (request: Request, response: Response) => {
        const fullRefreshToken = request.body.refreshToken
        try {
            const refreshPayload = jwt.verify(fullRefreshToken, SECRET_KEY)
            if (typeof refreshPayload == "string") throw new Error()
            const { sessionId, refreshToken } = refreshPayload
            const result = await accountService.refreshSession(sessionId, refreshToken)
            if (result.status != "ok") throw new Error()
            return response.status(200).json(signJWTAndSetCookie(result, response))
        }catch{
            response.cookie("access", "", { maxAge: 0, sameSite: "none", secure: true })
            return response.status(401).json({ status: "bad-credentials" })
        }
    })

    router.post("/association/nonce", jwtMiddleware, async (request: Request, response: Response) => {
        const stakeAddress: string = request.body.stakeAddress
        const result = await accountService.getAssociationNonce(stakeAddress)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.post("/association/signature", jwtMiddleware, async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const nonce = request.body.nonce
        const { key, signature } = request.body.signedMessage
        const result = await accountService.submitAssociationSignature(userId, nonce, key, signature)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.post("/session/test", async (request: Request, response: Response) => {
        console.log("REQUEST")
        console.log(request.headers)
        response.cookie("test", v4(), { maxAge: COOKIE_EXPIRACY, sameSite: "none", secure: true })
        console.log("RESPONSE")
        console.log(response.headersSent)
        response.sendStatus(200)
    })

    router.post("/association/nonce", async (request: Request, response: Response) => {
        const stakeAddress: string = request.body.stakeAddress
        const result = await accountService.getAssociationNonce(stakeAddress)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.post("/assets/claim/dragon-silver", jwtMiddleware, async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const stakeAddress: string = request.body.stakeAddress
        const result = await accountService.claimDragonSilver(userId, stakeAddress)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.post("/assets/claim/sign-and-submit", async (request: Request, response: Response) => {
        const {witness, tx, claimId} = request.body
        const result = await accountService.claimSignAndSubbmit(witness, tx, claimId)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.post("/assets/claim/status", async (request: Request, response: Response) => {
        const {claimId} = request.body
        console.log({claimId});
        const result = await accountService.claimStatus(claimId)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.get("/assets/inventory", jwtMiddleware, async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await accountService.getUserInventory(userId)
        if (result.status == "ok") return response.status(200).json(result)
        else return response.status(400).json(result)
    })

    router.get("/assets/test/grant", jwtMiddleware, async (request: Request, response: Response) => {
        const userId: string = request.auth!.userId
        const result = await accountService.grantTest(userId)
        return response.status(200).json({status: "ok"})
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