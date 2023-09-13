import compression from "compression"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import { AccountService } from "../service-account"
import { IdleQuestsService } from "../service-idle-quests"
import { KiliaBotServiceDsl } from "../service-kilia-bot"
import apiErrorHandler from "./error/api_error_handler"
import { accountRoutes } from "./routes-account"
import { idleQuestRoutes } from "./routes-idle-quests"
import { corsOptions } from "./settings"

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

    /* app.use((req, res, next) => {
        console.log(`Received ${req.method} request for ${req.url}`)
        next()
      }) */
    
    // Error handler middleware
    app.use(apiErrorHandler)
    
    // QUEST MODULE ROUTES
    app.use("/api/quests", idleQuestRoutes(idleQuestsService, kiliaBotService))
    app.use("/api/account", accountRoutes(accountService, kiliaBotService))
    
    
    return app
}


export { buildApp }

