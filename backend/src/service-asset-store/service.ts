import { UserNotificationDSl } from "../service-user-notification/service-spec";
import { LoggingContext } from "../tools-tracing";
import { SResult, success } from "../tools-utils";
import { AOTInventory } from "./inventory/aot-invenotry-dsl";
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
        this.depositAdventurers()
        return success({contractId: constractInfoResult.constractInfo.contractId})
    }

    private async depositAdventurers(){
        //mandar a firmar la tx de crear contrato
        //submitear la tx de crear elk contrato
        //maybe add some polling if marlowe sdk allows for it
        //get sellet tx
        //sign sellet tx
        //submit until it passes or time out
        //mark assets being in contract
        //build buyer tx
    }
}