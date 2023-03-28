
import { Response, Router } from "express"
import { Request } from "express-jwt"
import { AccountService } from "../service-account"
import jwt from "jsonwebtoken"
import { COOKIE_EXPIRACY, SECRET_KEY } from "./settings"

export const accountRoutes = (accountService: AccountService) => {
    const router = Router()    

    router.post('/discord/authenticate', async (request: Request, response: Response) => {
        const code: string = request.body.code
        const result = await accountService.authenticateDiscord(code)
        if (result.status == "ok") {
            const {session, refreshToken} = result.tokens
            const cookieToken = jwt.sign(session, SECRET_KEY);
            const fullRefreshToken = jwt.sign({refreshToken, sessionId: session.sessionId}, SECRET_KEY);
            response.cookie("access", cookieToken, { maxAge: COOKIE_EXPIRACY, sameSite: "none", secure: true });
            return response.status(200).json({ ...result, tokens: {session, refreshToken: fullRefreshToken} })
        } else 
            return response.status(401).json({ responseCode: result.status})
    })

    return router
}

