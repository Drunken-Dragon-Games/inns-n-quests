import { NextFunction, Response } from "npm:express@4.18.2"
import { Request } from "npm:express-jwt@8.4.1"

export const requestCatchError = (handler: (request: Request, response: Response) => Promise<void>) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await handler(request, response)
    } catch (error) {
        next(error)
    }
}