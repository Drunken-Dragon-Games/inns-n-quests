import { NextFunction, Request, Response } from "./deps.ts"

export const requestCatchError = (handler: (request: Request, response: Response) => Promise<void>) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await handler(request, response)
    } catch (error) {
        next(error)
    }
}