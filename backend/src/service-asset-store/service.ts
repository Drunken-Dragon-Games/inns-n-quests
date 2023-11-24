import { UserNotificationDSl } from "../service-user-notification/service-spec";
import { LoggingContext } from "../tools-tracing";
import { SResult, sfailure, success } from "../tools-utils";
import { AOTInventory } from "./inventory/aot-invenotry-dsl";
import { MarloweDSl } from "./marlowe/marlowe-dsl";
import { CreateContractResponse } from "./marlowe/models";
import { ADA, CompensatingAction, Token } from "./models";
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

    async initAOTContract(userId: string, buyerAddress: string, quantity: number, logger?: LoggingContext): Promise<SResult<{ contractId: string, depositTx: string, cartId: string }>> {
        const compensatingActions: CompensatingAction[] = []
        try {
          const reservedItems = await this.aotInventory.reserveAssets(quantity);
          compensatingActions.push({ command: "release assets", assets: reservedItems })
          const contractInfoResult = await this.marloweDSL.genInitContractTx(buyerAddress, this.changeAddress, reservedItems)
          if (contractInfoResult.ctype !== "success") throw new Error("Failed to generate contract transaction")
          const contractInfo = contractInfoResult.contractInfo
          const signedCreateContractTxResult = await this.marloweDSL.signCreateContractTx(contractInfo.tx.cborHex)
          if (signedCreateContractTxResult.ctype !== "success") throw new Error("Failed to sign contract transaction")
          await this.marloweDSL.submitContractTx(contractInfo.contractId, signedCreateContractTxResult.signedTx)
          await this.marloweDSL.awaitContract(contractInfo.contractId)
          //TODO: add price as argument
          const buyerAdaDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractInfo.contractId, buyerAddress, [ADA])
          if (buyerAdaDepositTX.ctype !== "success") throw new Error("Failed to geenrate ADA deposit transaction")
          //TODO: store the buyerAddress, the txId, the assets and the contract id under a cartId
          return success({ contractId: contractInfoResult.contractInfo.contractId, depositTx: buyerAdaDepositTX.textEnvelope.cborHex });
        } catch (error: any) {
          await this.rollbackSaga(compensatingActions)
          return sfailure(error.message)
        }
      }

    private async depositAdventurers(userId: string, buyerAddress: string, reservedItems: Token[], contractInfo: CreateContractResponse, compensatingActions: CompensatingAction[]){
        try {
            const signedCreateContractTxResult = await this.marloweDSL.signCreateContractTx(contractInfo.tx.cborHex)
            if (signedCreateContractTxResult.ctype !== "success") throw new Error("Failed to sign contract transaction")
            await this.marloweDSL.submitContractTx(contractInfo.contractId, signedCreateContractTxResult.signedTx)
            await this.marloweDSL.awaitContract(contractInfo.contractId)
            const sendingAssetsTx = await this.marloweDSL.genDepositIntoContractTX(contractInfo.contractId, this.changeAddress, reservedItems)
            if (sendingAssetsTx.ctype !== "success") throw new Error("Failed to generate AOT deposit transaction")
            //TODO: submit until it passes or time out
            const signedDepositAssetsTX = await this.marloweDSL.submitContractInteraciton(contractInfo.contractId, sendingAssetsTx.textEnvelope, sendingAssetsTx.transactionId)
            //TODO: poll this tx
            await this.aotInventory.markAssetsAsInContract(reservedItems, contractInfo.contractId)
            //TODO: agregar a tabla de carritos
            compensatingActions.push({command: "retrive assets", assets: reservedItems, contractId: contractInfo.contractId})
            //TODO: add price as argument
            const buyerAdaDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractInfo.contractId, buyerAddress, [ADA])
            //TODO: store buyer tx under a cart id (maybe where we also stored the contract id)
            this.notificaitons.notifyUser(userId, `yooo this worked: ${buyerAdaDepositTX}`)
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
          case "retrive assets":
            //this is like a whole thing
            return this.marloweDSL.retriveAssetsFromContract()
          default:
            return Promise.resolve()
        }
      }
}