// IMPORTANT: This file has a corresponding twin in the backend.
// Ensure that both files are kept in sync manually to maintain equality.
import * as models from "./models.ts"

export const servicePrefix = "blockchain"

export const blockchainEnpoints: models.Endpoints = {
    "health": {path:"/health", method: "get"},
    "getWalletAuthenticationSelfTx": {path:"/get-assosiation-tx", method: "post"},
}

export interface BlockchainService {

    health(): Promise<models.HealthStatus>

    getWalletAuthenticationSelfTx(address: string):Promise<models.AssosiationTxResponse>

}