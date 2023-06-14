import {Router, Response, NextFunction} from "npm:express@4.18.2";
import { Request } from "npm:express-jwt@8.4.1"
import { requestCatchError } from "../catch-error.ts";

import {CardanoDsl} from "./lucid-dsl.ts"
import { Resolution } from "../utypes.ts";

export const walletRoutes = (cardanoDSL: CardanoDsl) => {
    const router = Router() 

    router.post("/selfTx", requestCatchError(async (request: Request, response: Response) => {
        const {address} = request.body
        const txHash = await cardanoDSL.buildSelfTx(address)
        generateHttpResponse(txHash, response)
    }))

    // deno-lint-ignore no-explicit-any
    router.use((err: any, request: Request, response: Response, _next: NextFunction) => {
        console.error(err, request.originalUrl, request.method)
        console.error(err.message, { stack: err.stack })
        response.status(500).send("Internal server error.")
    })

    return router
}

const generateHttpResponse = (result: Resolution<unknown, unknown>, response: Response) => {
    if (result.status === 'failed') {
        console.error(`Request failed: ${result.reason || 'Unknown reason'}`)
        response.status(result.code || 409).json(result)
    } else {
        response.status(200).json(result)
    }
}