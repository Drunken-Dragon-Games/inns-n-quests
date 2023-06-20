import { Lucid, NativeScript } from "https://deno.land/x/lucid@0.10.6/mod.ts";
import { TransactionDSL } from "./lucid-dsl/dsl.ts";
import { BuildTxResponse, HealthStatus, TransactionHashReponse, SubmitTransactionReponse } from "./models.ts";
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

    async buildMintTx(address: string, policy: NativeScript, unit: string, quantityToMint: string, feeInfo?: {feeAddress: string, feeAmount: string}): Promise<BuildTxResponse> {
        return await this.transactionDSL.buildMintTx(address, policy, unit, quantityToMint, feeInfo)
    }

    async getTxHashFromTransaction(serilizedTransaction: string): Promise<TransactionHashReponse> {
        return await this.transactionDSL.hashSerializedTransaction(serilizedTransaction)
    }

    async submitTransaction(serilizedTransaction: string): Promise<SubmitTransactionReponse> {
        return await this.transactionDSL.submitSerializedTransaction(serilizedTransaction)
    }



}

