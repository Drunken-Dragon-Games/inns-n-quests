import { Response, Request, NextFunction, ErrorRequestHandler } from "express"
import ApiError from "./api_error.js"

const apiErrorHandler: ErrorRequestHandler = (err: Error, request: Request, response: Response, next: NextFunction) => {
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
    else return response.status(500).json({
        message: "Something went wrong",
        code: "server_error"
    });
}

export default apiErrorHandler;