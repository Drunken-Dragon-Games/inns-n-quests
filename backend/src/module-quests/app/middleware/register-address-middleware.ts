import { Player } from "../../players/models.js";
import { Response, NextFunction } from "express";
import { Request } from "express-jwt";


/**
 * Middleware that handles player registration
 * If the DDU app sends a request with a token that contains a stake address that
 * is not registered yet in the Idle Quests, this method will create a player
 * with that stake address
 */
export const registerAddressMidleware = async (request: Request, response: Response, next: NextFunction) => {
    if (!request.path.includes("validate")){
        
        try {        
            const userId = request.auth!.userId
            const player = await Player.findCreateFind({
                where: {
                    user_id: userId
                }
            });
        } catch (error) {
            next(error)
        }
    }
    next()
}