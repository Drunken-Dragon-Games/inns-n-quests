import compression from "compression"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import { AccountService } from "../service-account.js"
import { IdleQuestsService } from "../service-idle-quests.js"
import apiErrorHandler from "./error/api_error_handler.js"
import { accountRoutes } from "./routes-account.js"
import { idleQuestRoutes } from "./routes-idle-quests.js"
import { corsOptions } from "./settings.js"
import { jwtMiddleware } from "./jwt_middleware.js"
import { KiliaBotServiceDsl } from "../service-kilia-bot.js"

dotenv.config()

const buildApp = async (
    accountService: AccountService,
    idleQuestsService: IdleQuestsService, 
    kiliaBotService? : KiliaBotServiceDsl
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
    app.use("/api/quests", jwtMiddleware, idleQuestRoutes(idleQuestsService, kiliaBotService))
    app.use("/api/account", accountRoutes(accountService, kiliaBotService))
    
    // Error handler middleware
    app.use(apiErrorHandler)
    return app
}


export { buildApp }

