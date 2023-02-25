import { NextFunction, Response } from "express"
import { Request } from "express-jwt"
import NodeCache from "node-cache"

const Cache = new NodeCache({deleteOnExpire: true});

export const limitRequestsPerSecondByUserId = (request: Request, response: Response, next: NextFunction) => {
    const userId: string = request.auth!.userId
    const key = `${request.path}_${userId}`
    if (Cache.has(key)) {
        console.warn(`ENDPOINT ${request.path} SPAMMED! User ID: ${userId}`)
        return response.status(409).json({
            "message": "You can't spam this endpoint",
            "code": "too-many-requests"
        })
    }
    let cacheStatus = Cache.set(`key`, null, 2)
    if (!cacheStatus) {
        throw new Error("Transaction could not be stored in memory")
    }
    next()
}
