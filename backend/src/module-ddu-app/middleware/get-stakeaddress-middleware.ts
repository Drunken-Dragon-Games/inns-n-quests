import { Request } from "express-jwt";
import { Response, NextFunction } from "express";
import ApiError from "../../module-quests/app/error/api_error.js";
import { withTracing } from "../../module-quests/base-logger.js";
import { IdentityService } from "../../service-identity/index.js";

export const getStakeAddressMiddleware = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    if (request.auth == undefined) return next()
    try {
        const logger = withTracing(request)
        const userInfo = await identityService.resolveUser({ ctype: "user-id", userId: request.auth!.userId }, logger)
        if (userInfo.status == "unknown-user-id") throw new ApiError(401, "unknown_user_id", "Credentials contained bad user id")
        if (userInfo.info.knownStakeAddresses.length > 0) {
            request.auth!.stake_address = userInfo.info.knownStakeAddresses[0]
        }
        next()
    } catch (error) {
        next(error)
    }
}