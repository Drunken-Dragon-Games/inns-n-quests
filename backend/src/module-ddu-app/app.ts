import express, { Request, Response, Router } from "express";
import cookieParser from "cookie-parser"
import { corsOptions } from "./settings"
import cors from "cors"
import { loadAccountManagementRoutes, loadUserRoutes, loadAccountRegisterRoutes } from "./routes"
import apiErrorHandler from "./error/api_error_handler"
import dotenv from "dotenv"
import { IdentityService } from "../service-identity";
import { AssetManagementService } from "../service-asset-management";
import helmet from "helmet"
import { jwtMiddleware } from "../module-quests/app/middleware/jwt_middleware";
import { getStakeAddressMiddleware } from "../module-quests/app/middleware/get-stakeaddress-middleware";
import { validateAddressMiddleware } from "../module-quests/app/middleware/validate_address";
import { registerAddressMidleware } from "../module-quests/app/middleware/register-address-middleware";
import { loadPlayerRoutes } from "../module-quests/players/routes";
import { loadAdventurerRoutes } from "../module-quests/adventurers/routes";
import { loadQuestRoutes } from "../module-quests/quests/routes";
import { Sequelize } from "sequelize";
import compression from "compression"
import { IdleQuestsService } from "../service-idle-quests";
import { WellKnownPolicies } from "../registry-policies";

dotenv.config()
const questRootPath = "/quests/api"

const buildApp = async (identityService: IdentityService, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService, wellKnownPolicies: WellKnownPolicies, database: Sequelize) => {
    const app = express();
    
    const healthEndpoint = Router()
    healthEndpoint.get("/health", (req: Request, res: Response) => { res.status(200).json({ status: "ok" }) })
    
    app.use(helmet({crossOriginResourcePolicy: false,}))
    app.disable('x-powered-by')

    // MIDDLEWARE
    app.use("/static", express.static(__dirname + "/static"));
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors(corsOptions))
    app.use(questRootPath, healthEndpoint)
    app.use(compression())
    app.use(questRootPath, jwtMiddleware)
    app.use(questRootPath, getStakeAddressMiddleware(identityService))
    app.use(questRootPath, validateAddressMiddleware)
    app.use(questRootPath, registerAddressMidleware)
    
    // ROUTES
    app.use("/api", healthEndpoint)
    app.use("/api", loadAccountManagementRoutes(identityService))
    app.use("/api", loadUserRoutes(identityService, assetManagementService, wellKnownPolicies))
    app.use("/api", loadAccountRegisterRoutes(identityService))
    
    // QUEST MODULE ROUTES
    app.use(questRootPath, loadPlayerRoutes(identityService, assetManagementService, wellKnownPolicies))
    app.use(questRootPath, (await loadAdventurerRoutes(database, assetManagementService, idleQuestsService, wellKnownPolicies)))
    app.use(questRootPath, loadQuestRoutes(database, assetManagementService, idleQuestsService))
    
    // Error handler middleware
    app.use(apiErrorHandler)
    return app
}


export { buildApp };