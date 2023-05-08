import compression from "compression"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import { AccountService } from "../service-account"
import { IdleQuestsService } from "../service-idle-quests"
import apiErrorHandler from "./error/api_error_handler"
import { accountRoutes } from "./routes-account"
import { idleQuestRoutes } from "./routes-idle-quests"
import { corsOptions } from "./settings"
import { jwtMiddleware } from "./jwt_middleware"

dotenv.config()

const buildApp = async (
    accountService: AccountService,
    idleQuestsService: IdleQuestsService, 
) => {
    const app = express()
    
    // MIDDLEWARE
    //app.use("/static", express.static(__dirname + "/static"))
    app.use(helmet({crossOriginResourcePolicy: false,}))
    app.disable('x-powered-by')
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors(corsOptions))
    app.use(compression())

    
    // QUEST MODULE ROUTES
    app.use("/api/quests", jwtMiddleware, idleQuestRoutes(idleQuestsService))
    app.use("/api/account", accountRoutes(accountService))
    
    // Error handler middleware
    app.use(apiErrorHandler)
    return app
}


export { buildApp }

