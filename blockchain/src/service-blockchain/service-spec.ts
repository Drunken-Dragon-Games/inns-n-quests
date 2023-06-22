// IMPORTANT: This file has a corresponding twin in the backend.
// Ensure that both files are kept in sync manually to maintain equality.
import { NativeScript } from "https://deno.land/x/lucid@0.10.6/mod.ts"
import * as models from "./models.ts"

export const servicePrefix = "blockchain"

export const blockchainEnpoints: models.Endpoints = {
    "health": {path:"/health", method: "get"},
    "getWalletAuthenticationSelfTx": {path:"/get-assosiation-tx", method: "POST"},
    "getTxHashFromTransaction": {path: "/get-tx-hash", method: "POST"},
    "submitTransaction": {path: "/submit-tx", method: "POST"},
    "buildMintTx": {path: "get-mint-tx", method: "POST"}
}

export interface BlockchainService {

    health(): Promise<models.HealthStatus>

    getWalletAuthenticationSelfTx(address: string):Promise<models.BuildTxResponse>

    buildMintTx(address: string, asset: {policyId: string, unit:string}, quantityToClaim:string, feeInfo?: {feeAddress: string, feeAmount: string}):Promise<models.BuildTxResponse>

    getTxHashFromTransaction(serilizedTransaction: string): Promise<models.TransactionHashReponse>

    submitTransaction(serilizedTransaction: string): Promise<models.SubmitTransactionReponse>

}