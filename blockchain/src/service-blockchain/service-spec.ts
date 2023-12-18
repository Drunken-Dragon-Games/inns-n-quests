// IMPORTANT: This file has a corresponding twin in the backend.
// Ensure that both files are kept in sync manually to maintain equality.
import * as models from "./models.ts"

export const servicePrefix = "blockchain"

export const blockchainEnpoints: models.Endpoints = {
    "health": {path:"/health", method: "get"},
    "getWalletAuthenticationSelfTx": {path:"/get-assosiation-tx", method: "POST"},
    "getTxHashFromTransaction": {path: "/get-tx-hash", method: "POST"},
    "submitTransaction": {path: "/submit-tx", method: "POST"},
    "buildMintTx": {path: "/get-mint-tx", method: "POST"},
    "buildBulkMintTx": {path: "/get-bulk-mint-tx", method: "POST"},
    "buildAssetsSellTx": {path: "/get-sell-tx", method: "POST"},
}

export interface BlockchainService {

    health(): Promise<models.HealthStatus>

    getWalletAuthenticationSelfTx(address: string):Promise<models.BuildTxResponse>

    buildMintTx(address: string, asset: {policyId: string, unit:string}, quantityToClaim:string, feeInfo?: {feeAddress: string, feeAmount: string}):Promise<models.BuildTxResponse>

    buildBulkMintTx(address: string, assetsInfo: {[policyId: string]: {unit:string, quantityToClaim:string}[]}, feeInfo?: {feeAddress: string, feeAmount: string}): Promise<models.BuildTxResponse>

    buildAssetsSellTx(buyerAddress: string, sellerAddress: string, assetsInfo: {policyId: string, publicAssetName: string, amount: number}[], assetsAdaVal: number): Promise<models.BuildTxResponse>

    getTxHashFromTransaction(serilizedTransaction: string): Promise<models.TransactionHashReponse>

    submitTransaction(serilizedTransaction: string): Promise<models.SubmitTransactionReponse>

}
