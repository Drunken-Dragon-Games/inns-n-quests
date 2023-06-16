import { Lucid } from "https://deno.land/x/lucid@0.10.6/mod.ts";
import { LucidDsl } from "./lucid-dsl/dsl.ts";
import { AssosiationTxResponse, HealthStatus } from "./models.ts";
import { BlockchainService } from "./service-spec.ts";

export type BlockchainServiceConfig = {
    baseURL: string
}

export class BlockchainServiceDsl implements BlockchainService {

    private lucidDSL: LucidDsl

    constructor(lucidInstance: Lucid){
        this.lucidDSL = new LucidDsl(lucidInstance)
    }

    async health(): Promise<HealthStatus> {
        return {status: "ok", value: ""}
    }

    async getWalletAuthenticationSelfTx(address: string): Promise<AssosiationTxResponse> {
        return await this.lucidDSL.buildSelfTx(address)
    }

}

