import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import helmet from "helmet";
import { Sequelize } from "sequelize";
import { loadPlayerRoutes } from "../module-quests/players/routes";
import { WellKnownPolicies } from "../registry-policies";
import { AssetManagementService } from "../service-asset-management";
import { IdentityService } from "../service-identity";
import { IdleQuestsService } from "../service-idle-quests";
import apiErrorHandler from "./error/api_error_handler";
import { getStakeAddressMiddleware } from "./middleware/get-stakeaddress-middleware";
import { jwtMiddleware } from "./middleware/jwt_middleware";
import { registerAddressMidleware } from "./middleware/register-address-middleware";
import { validateAddressMiddleware } from "./middleware/validate_address";
import { limitRequestsPerSecondByUserId } from "./requests-limiter";
import { loadAccountManagementRoutes, loadAccountRegisterRoutes, loadUserRoutes } from "./routes";
import { idleQuestRoutes } from "./routes-idle-quests";
import { corsOptions } from "./settings";

dotenv.config()
const questRootPath = "/quests/api"

const buildApp = async (identityService: IdentityService, assetManagementService: AssetManagementService, idleQuestsService: IdleQuestsService, wellKnownPolicies: WellKnownPolicies, database: Sequelize) => {
    const app = express();
    
    const healthEndpoint = Router()
    healthEndpoint.get("/health", (req: Request, res: Response) => { res.status(200).json({ status: "ok" }) })
    
    // MIDDLEWARE
    //app.use("/static", express.static(__dirname + "/static"));
    app.use(helmet({crossOriginResourcePolicy: false,}))
    app.disable('x-powered-by')
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors(corsOptions))
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
    app.use(questRootPath, idleQuestRoutes(idleQuestsService))
    
    // Error handler middleware
    app.use(apiErrorHandler)
    return app
}


export { buildApp };
