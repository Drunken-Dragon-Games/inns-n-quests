import { UserNotificationDSl } from "../service-user-notification/service-spec";
import { LoggingContext } from "../tools-tracing";
import { SResult, success } from "../tools-utils";
import { AOTInventory } from "./inventory/aot-invenotry-dsl";
import { MarloweDSl } from "./marlowe/marlowe-dsl";
import { CreateContractResponse } from "./marlowe/models";
import { ExitComand } from "./models";
import { AssetStoreDSL } from "./service-spec";

export type AssetStoreServiceConfig = {
    changeAddress: string,
    AOTPrice: number
}

class AssetStoreService implements AssetStoreDSL {
    constructor(
        private readonly changeAddress: string,
        private readonly AOTPrice: number,
        private readonly marloweDSl: MarloweDSl,
        private readonly notificaitons: UserNotificationDSl,
        private readonly aotInvenotry: AOTInventory
        ){}

    async loadDatabaseModels(): Promise<void>{}

    async unloadDatabaseModels(): Promise<void>{}

    async initAOTContract(userId: string, buyerAddres: string, quantity: number, logger?: LoggingContext): Promise<SResult<{contractId: string}>>{
        const reservedItems = await this.aotInvenotry.reserveAssets(quantity)
        const constractInfoResult = await this.marloweDSl.genInitContractTx(buyerAddres, this.changeAddress, reservedItems)
        if (constractInfoResult.ctype !== "success") {
            await this.aotInvenotry.releaseReservedAssets(reservedItems)
            return constractInfoResult
        }
        //this is purposly not being awaited
        this.depositAdventurers(constractInfoResult.constractInfo)
        //i should propably store this contract id allong with the assets it holds
        return success({contractId: constractInfoResult.constractInfo.contractId})
    }

    private async depositAdventurers(contractInfo: CreateContractResponse){
        const signedCreateContractTxResult = await this.marloweDSl.signCreateContractTx(contractInfo.tx.cborHex)
        //I need to define an exit strategy probably woudl be best to treat this like a saga
        if (signedCreateContractTxResult.ctype !== "success") return
        await this.marloweDSl.submitContractTx(contractInfo.contractId, signedCreateContractTxResult.signedTx)
        //maybe add some polling if marlowe sdk allows for it
        //get sellet tx
        //sign sellet tx
        //submit until it passes or time out
        //mark assets being in contract
        //build buyer tx
        //store buyer tx under a cart id (maybe where we also stored the contract id)

    }

    private exitStrategy(comands: ExitComand[]){

    }
}