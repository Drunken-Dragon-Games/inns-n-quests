import { Response, Router, Request as ExpressRequest, NextFunction } from "express"
import { Request } from "express-jwt"

export const requestCatchError = (handler: (request: Request, response: Response) => Promise<void>) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await handler(request, response)
    } catch (error) {
        next(error)
    }
}