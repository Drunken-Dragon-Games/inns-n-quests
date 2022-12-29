// import express from "express"
// import {sequelize} from "./database/database"
// import {corsOptions, PORT} from "./settings"
// import { jwtMiddleware } from "./middleware/jwt_middleware"

// import healthEndpoint from "./health"
// import playerRouter from "../players/routes"
// import adventurerRouter from "../adventurers/routes"
// import questRouter from "../quests/routes"
// import warEffortRouter from "../war-effort/routes"

// import helmet from "helmet"
// import compression from "compression"
// import cors from "cors"
// import cookieParser from 'cookie-parser'
// import { validateAddressMiddleware } from "./middleware/validate_address"
// import apiErrorHandler from "./error/api_error_handler"
// import { startupMigration } from "./database/migration_scripts/migrate"
// import { registerAddressMidleware } from "./middleware/register-address-middleware"
// import { getStakeAddressMiddleware } from "./middleware/get-stakeaddress-middleware"

// const rootPath = "/quests/api"
// const app = express();

// // MIDDLEWARE
// app.use(helmet({crossOriginResourcePolicy: false,}))
// app.disable('x-powered-by');
// app.use(rootPath, healthEndpoint);
// app.use(cors(corsOptions));
// //app.use(winstonMiddleware);
// app.use(compression());
// app.use(express.json());
// app.use(cookieParser());
// app.use(jwtMiddleware);
// app.use(getStakeAddressMiddleware)
// app.use(validateAddressMiddleware);
// app.use(registerAddressMidleware)
// app.use('/static', express.static(__dirname+'/static'));

// // ROUTES
// app.use(rootPath, playerRouter);
// app.use(rootPath, adventurerRouter);
// app.use(rootPath, questRouter);
// app.use(rootPath, warEffortRouter);

// // UPDATED ERROR HANDLER
// app.use(apiErrorHandler)

// async function connectToDb(){
//     try {
//         await sequelize.authenticate();
//         await startupMigration();
//         console.log("Connection has been established successfully");
//         return true;
//     } catch (error) { 
//         console.log(error);
//         console.log("Database could not be synchronized");
//         return false
//     }
// }

// connectToDb()

// module.exports = {app, sequelize};