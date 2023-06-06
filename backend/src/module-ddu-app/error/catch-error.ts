import { Response, Router, Request as ExpressRequest, NextFunction } from "express"
import { Request } from "express-jwt"
import { KiliaBotServiceDsl } from "../../service-kilia-bot"

export class requestErrorHanlder {
    constructor(private kilia?: KiliaBotServiceDsl) {}
    catchErrors (handler: (request: Request, response: Response) => Promise<void>)  {
        return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
            try {
                await handler(request, response)
            } catch (error: any) {
                if (this.kilia){
                    this.kilia.sendErrorMessage(error, request.originalUrl, request.method)
                } 
                next(error)
            }
        }
    }
}
export const requestCatchError = (handler: (request: Request, response: Response) => Promise<void>) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await handler(request, response)
    } catch (error) {
        next(error)
    }
}