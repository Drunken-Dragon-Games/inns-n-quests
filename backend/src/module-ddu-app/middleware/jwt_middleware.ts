import { Request } from "express"
import { SECRET_KEY } from "../settings"

import { expressjwt, ExpressJwtRequest } from "express-jwt";
import { Jwt } from "jsonwebtoken";
import { IToken } from "../types"
import { Session } from "../../service-identity";

// FUNCTION TO RETRIEVE AUTH TOKEN FROM THE COOKIES INSTED OF THE HEADERS
const getToken = async (request: Request) => {
    if (request.cookies.access != undefined) {
        return request.cookies.access
    } else {
        return null
    }
}

// FUNCTION TO REVOKE THE TOKEN IF IT IS EXPIRED
const checkExpiration = async (request: Request, token: Jwt | undefined) => {
    let tokenInstance = token?.payload as Session
    if (tokenInstance.expiration < Date.now()) {
        return true
    }
    return false;
}


// AUTHENTICATION MIDDLEWARE CONFIGURATION
const jwtMiddleware = expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"],
    isRevoked: checkExpiration,
    credentialsRequired: true,
    getToken: getToken
});

export {
    jwtMiddleware,
    IToken
}

