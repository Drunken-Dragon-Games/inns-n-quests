import { v4 } from "uuid"
import { Response, Router } from "express"
import { Request } from "express-jwt"
import { AccountService } from "../service-account"
import jwt from "jsonwebtoken"
import { COOKIE_EXPIRACY, SECRET_KEY } from "./settings"
import { AuthRequest } from "./types"
import { AuthenticationResult } from "../service-identity"

export const accountRoutes = (accountService: AccountService) => {
    const router = Router()    

    router.post("/discord/authenticate", async (request: Request, response: Response) => {
        const code: string = request.body.code
        const result = await accountService.authenticateDiscord(code)
        if (result.status == "ok") {
            return response.status(200).json(signJWTAndSetCookie(result, response))
        } else 
            return response.status(401).json(result)
    })

    router.post("/session/signout", async (request: Request, response: Response) => {
        const sessionId = (request as AuthRequest).auth.sessionId
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

    router.post("/session/test", async (request: Request, response: Response) => {
        console.log("REQUEST")
        console.log(request.headers)
        response.cookie("test", v4(), { maxAge: COOKIE_EXPIRACY, sameSite: "none", secure: true })
        console.log("RESPONSE")
        console.log(response.headersSent)
        response.sendStatus(200)
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