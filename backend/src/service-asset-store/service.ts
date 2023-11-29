import { LoggingContext } from "../tools-tracing";
import { SResult, sfailure, success } from "../tools-utils";
import { AotCartDSL } from "./carts/aot-cart-dsl";
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
          const adaQuantity = (quantity * this.AOTPrice).toString()
          const buyerAdaDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractInfo.contractId, buyerAddress, [{asset: ADA, quantity: adaQuantity}])
          if (buyerAdaDepositTX.ctype !== "success") throw new Error("Failed to geenrate ADA deposit transaction")
          const cartId = await AotCartDSL.create({buyerAddress, AdaDepositTxId: buyerAdaDepositTX.transactionId, Assets: reservedItems})
          return success({ contractId: contractInfoResult.contractInfo.contractId, depositTx: buyerAdaDepositTX.textEnvelope.cborHex, cartId })
        } catch (error: any) {
          await this.rollbackSaga(compensatingActions)
          console.error(`error on init AOT contract ${error.message}`)
          return sfailure(error.message)
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