import {Router, Response, NextFunction} from "npm:express@4.18.2"
import { Request } from "npm:express-jwt@8.4.1"
import { requestCatchError } from "../catch-error.ts"
import { Resolution } from "../utypes.ts"
import { BlockchainService, blockchainEnpoints } from "./service-spec.ts"

// IMPORTANT: Maintain a 1-to-1 relationship between service methods and exposed routes.
// Ensure that each service method corresponds to a specific exposed route as this relationship is enforced manually.
export const blockchainRoutes = (blockchainService: BlockchainService) => {
    const router = Router()

    router.get(blockchainEnpoints.health.path, requestCatchError(async (request: Request, response: Response) => {
        const helthStatus = await blockchainService.health()
        generateHttpResponse(helthStatus, response)
    }))

    router.post(blockchainEnpoints.getWalletAuthenticationSelfTx.path, requestCatchError(async (request: Request, response: Response) => {
        const {address} = request.body
        const txInfo = await blockchainService.getWalletAuthenticationSelfTx(address)
        generateHttpResponse(txInfo, response)
    }))

    router.post(blockchainEnpoints.getTxHashFromTransaction.path, requestCatchError(async (request: Request, response: Response) => {
        const {serilizedTransaction} = request.body
        const txHash = await blockchainService.getTxHashFromTransaction(serilizedTransaction)
        generateHttpResponse(txHash, response)
    }))

    router.post(blockchainEnpoints.submitTransaction.path, requestCatchError(async (request: Request, response: Response) => {
        const {serilizedSignedTransaction} = request.body
        const txHash = await blockchainService.submitTransaction(serilizedSignedTransaction)
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
    if (result.status === "invalid") {
        console.error(`Request failed: ${result.reason || 'Unknown reason'}`)
        response.status(result.code || 409).json(result)
    } else {
        response.status(200).json(result)
    }
}