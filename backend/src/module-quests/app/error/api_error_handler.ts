import { Response, 
         Request,
         NextFunction } from "express"
import ApiError from "./api_error"


const apiErrorHandler = (err: any, request: Request, response: Response, next: NextFunction) => {
    console.error(err)
    if (err instanceof ApiError) {
        return response.status(err.status).json({
            message: err.message,
            code: err.code
        });
    }
    else if (err.name === "UnauthorizedError") {
        return response.status(401).send({
          message: "The token is invalid",
          code: "invalid_token"
        });
      }
    return response.status(500).json({
        message: "Something went wrong",
        code: "server_error",
        error: err
    });
}

export default apiErrorHandler;