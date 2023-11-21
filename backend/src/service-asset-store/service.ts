import { UserNotificationDSl } from "../service-user-notification/service-spec";
import { LoggingContext } from "../tools-tracing";
import { SResult, sfailure, success } from "../tools-utils";
import { AOTInventory } from "./inventory/aot-invenotry-dsl";
import { MarloweDSl } from "./marlowe/marlowe-dsl";
import { CreateContractResponse } from "./marlowe/models";
import { CompensatingAction } from "./models";
import { AssetStoreDSL } from "./service-spec";

export type AssetStoreServiceConfig = {
    changeAddress: string,
    AOTPrice: number
}

class AssetStoreService implements AssetStoreDSL {
    constructor(
        private readonly changeAddress: string,
        private readonly AOTPrice: number,
        private readonly marloweDSL: MarloweDSl,
        private readonly notificaitons: UserNotificationDSl,
        private readonly aotInventory: AOTInventory
        ){}

    async loadDatabaseModels(): Promise<void>{}

    async unloadDatabaseModels(): Promise<void>{}

    async initAOTContract(userId: string, buyerAddress: string, quantity: number, logger?: LoggingContext): Promise<SResult<{ contractId: string }>> {
        const compensatingActions: CompensatingAction[] = []
        try {
          const reservedItems = await this.aotInventory.reserveAssets(quantity);
          compensatingActions.push({ command: "release assets", assets: reservedItems })
          const contractInfoResult = await this.marloweDSL.genInitContractTx(buyerAddress, this.changeAddress, reservedItems)
          if (contractInfoResult.ctype !== "success") throw new Error("Failed to generate contract transaction")
          // Purposely not awaited
          this.depositAdventurers(userId, contractInfoResult.contractInfo, compensatingActions);
          return success({ contractId: contractInfoResult.contractInfo.contractId });
        } catch (error: any) {
          await this.rollbackSaga(compensatingActions)
          return sfailure(error.message)
        }
      }

    private async depositAdventurers(userId: string, contractInfo: CreateContractResponse, compensatingActions: CompensatingAction[]){
        try {
            const signedCreateContractTxResult = await this.marloweDSL.signCreateContractTx(contractInfo.tx.cborHex)
            if (signedCreateContractTxResult.ctype !== "success") throw new Error("Failed to sign contract transaction")
            await this.marloweDSL.submitContractTx(contractInfo.contractId, signedCreateContractTxResult.signedTx)
            //maybe add some polling if marlowe sdk allows for it
            //get seller tx
            //sign seller tx
            //submit until it passes or time out
            //mark assets being in contract
            //build buyer tx
            //store buyer tx under a cart id (maybe where we also stored the contract id)
            //notify of success
        } catch (error: any) {
            await this.rollbackSaga(compensatingActions)
            this.notificaitons.notifyUser(userId, `yooo this shit broke: ${error.message}`)
        }
    }

    private async rollbackSaga(actions: CompensatingAction[]){
        actions.reverse().forEach(async action => {
            await this.executeRollback(action)
        })
    }
    private executeRollback(rollbackAction: CompensatingAction): Promise<void> {
        switch (rollbackAction.command) {
          case "release assets":
            return this.aotInventory.releaseReservedAssets(rollbackAction.assets)
          default:
            return Promise.resolve()
        }
      }
}