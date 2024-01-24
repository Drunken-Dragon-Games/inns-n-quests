import { TransactionDSL } from "./lucid-dsl/dsl.ts";
import { BuildOrderSellResponse, BuildTxResponse, HealthStatus, SubmitTransactionReponse, TransactionHashReponse } from "./models.ts";
import { BlockchainService } from "./service-spec.ts";

export type BlockchainServiceConfig = {
    baseURL: string
}

export class BlockchainServiceDsl implements BlockchainService {

    constructor(private transactionDSL: TransactionDSL){}

    async health(): Promise<HealthStatus> {
        return {status: "ok", value: ""}
    }

    async getWalletAuthenticationSelfTx(address: string): Promise<BuildTxResponse> {
        return await this.transactionDSL.buildSelfTx(address)
    }

    async buildMintTx(address: string, asset: {policyId: string, unit:string}, quantityToClaim:string, feeInfo?: {feeAddress: string, feeAmount: string}): Promise<BuildTxResponse> {
        return await this.transactionDSL.buildMintTx(address, asset, quantityToClaim, feeInfo)
    }
    
    async buildBulkMintTx(address: string, assetsInfo: {[policyId: string]: {unit:string, quantityToClaim:string}[]}): Promise<BuildTxResponse> {
        return await this.transactionDSL.buildBulkMintTx(address, assetsInfo)
    }

    async buildAssetsSellTx(buyerAddress: string, sellerAddress: string, assetsInfo: {policyId: string, publicAssetName: string, amount: number}[], assetsAdaVal: number, orderId: string): Promise<BuildOrderSellResponse>{
        return await this.transactionDSL.buildAssetsSellTx(buyerAddress, sellerAddress, assetsInfo, assetsAdaVal, orderId)
    }

    async getTxHashFromTransaction(serilizedTransaction: string): Promise<TransactionHashReponse> {
        return await this.transactionDSL.hashSerializedTransaction(serilizedTransaction)
    }

    async submitTransaction(serilizedTransaction: string): Promise<SubmitTransactionReponse> {
        return await this.transactionDSL.submitSerializedTransaction(serilizedTransaction)
    }
}
