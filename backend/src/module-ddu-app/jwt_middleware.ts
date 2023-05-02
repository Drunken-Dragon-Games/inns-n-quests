import { Request } from "express"
import { SECRET_KEY } from "./settings"

import { expressjwt } from "express-jwt"
import { Jwt } from "jsonwebtoken"
import { Session } from "../service-identity"

const getToken = async (request: Request) => 
    request.cookies.access

const checkExpiration = async (request: Request, token?: Jwt) => {
    const tokenInstance = token?.payload as Session
    return tokenInstance.expiration < Date.now()
}

export const jwtMiddleware = expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
    credentialsRequired: true,
    // TODO: Enable this later!
    //audience: "https://ddu.gg/api",
    //issuer: "https://ddu.gg",
    getToken: getToken,
    isRevoked: checkExpiration,
})
