import express, { Request, Response, Router } from "express";
import cookieParser from "cookie-parser"
import { corsOptions } from "./settings"
import cors from "cors"
import { loadAccountManagementRoutes, loadUserRoutes, loadAccountRegisterRoutes } from "./routes"
import apiErrorHandler from "./error/api_error_handler"
import dotenv from "dotenv"
import { IdentityService } from "../service-identity";
import { AssetManagementService } from "../service-asset-management";
dotenv.config()

const buildApp = (identityService: IdentityService, assetManagement: AssetManagementService) => {
    const app = express();
    
    const healthEndpoint = Router()
    healthEndpoint.get("/health", (req: Request, res: Response) => { res.status(200).json({ status: "ok" }) })
    
    // MIDDLEWARE
    app.use("/static", express.static(__dirname + "/static"));
    app.use(express.json())
    app.use(cookieParser());
    app.use(cors(corsOptions));
    
    // ROUTES
    app.use("/api", healthEndpoint)
    app.use("/api", loadAccountManagementRoutes(identityService))
    app.use("/api", loadUserRoutes(identityService, assetManagement))
    app.use("/api", loadAccountRegisterRoutes(identityService))
    
    
    // Error handler middleware
    app.use(apiErrorHandler)
    return app
}


export { buildApp };