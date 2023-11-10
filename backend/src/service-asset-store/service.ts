import { LoggingContext } from "../tools-tracing";
import { SResult, success } from "../tools-utils";
import { MarloweDSl } from "./marlowe/marlowe-dsl";
import { AssetStoreDSL } from "./service-spec";

export type AssetStoreServiceConfig = {
    changeAddress: string,
    AOTPrice: number
}

class AssetStoreService implements AssetStoreDSL {
    constructor(
        private readonly changeAddress: string,
        private readonly AOTPrice: number,
        private readonly marloweDSl: MarloweDSl
        ){}

    async loadDatabaseModels(): Promise<void>{}

    async unloadDatabaseModels(): Promise<void>{}

    async initAOTContract(buyerAddres: string, quantity: number, logger?: LoggingContext): Promise<SResult<{contractId: string}>>{
        const constractInfoResult = await this.marloweDSl.genInitAOTContractTx(buyerAddres, this.changeAddress, quantity)
        if (constractInfoResult.ctype !== "success") return constractInfoResult
        //this is purposly not being awaited
        this.depositAdventurers()
        return success({contractId: constractInfoResult.constractInfo.contractId})
    }

    private async depositAdventurers(){}
}