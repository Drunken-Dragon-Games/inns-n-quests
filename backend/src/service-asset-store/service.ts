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

export class AssetStoreService implements AssetStoreDSL {
    constructor(
        private readonly changeAddress: string,
        private readonly AOTPrice: number,
        private readonly marloweDSL: MarloweDSl,
        private readonly aotInventory: AOTInventory
        ){}

    async loadDatabaseModels(): Promise<void>{}

    async unloadDatabaseModels(): Promise<void>{}

    async initAOTContract(buyerAddress: string, quantity: number, logger?: LoggingContext): Promise<SResult<{ contractId: string, depositTx: string, cartId: string }>> {
        const compensatingActions: CompensatingAction[] = []
        try {
          const reservedItems = await this.aotInventory.reserveAssets(quantity)
          compensatingActions.push({ command: "release assets", assets: reservedItems })
          const contractInfoResult = await this.marloweDSL.genInitContractTx(buyerAddress, this.changeAddress, reservedItems)
          if (contractInfoResult.ctype !== "success") throw new Error("Failed to generate contract transaction")
          const signedCreateContractTxResult = await this.marloweDSL.signCreateContractTx(contractInfoResult.contractInfo.tx.cborHex)
          const contractId = contractInfoResult.contractInfo.contractId
          if (signedCreateContractTxResult.ctype !== "success") throw new Error("Failed to sign contract transaction")
          await this.marloweDSL.submitContractTx(contractId, signedCreateContractTxResult.signedTx)
          await this.marloweDSL.awaitContract(contractId)
          const adaQuantity = (quantity * this.AOTPrice).toString()
          const buyerAdaDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractId, buyerAddress, [{asset: ADA, quantity: adaQuantity}])
          if (buyerAdaDepositTX.ctype !== "success") throw new Error("Failed to geenrate ADA deposit transaction")
          const cartId = await AotCartDSL.create({buyerAddress, adaDepositTxId: buyerAdaDepositTX.transactionId, assets: reservedItems, contractId})
          return success({ contractId: contractId, depositTx: buyerAdaDepositTX.textEnvelope.cborHex, cartId })
        } catch (error: any) {
          await this.rollbackSaga(compensatingActions)
          console.error(`error on init AOT contract ${error.message}`)
          return sfailure(error.message)
        }
      }

    async submitSignedContactInteraction(signedTx: string, contractId: string, cartId: string){
      try {
        const cart = await AotCartDSL.get(cartId)
        if(!cart) throw new Error("Could not find cart by id")
        //TODO: check the client types
        const submitResult = await this.marloweDSL.submitContractInteraciton(signedTx, contractId, cart.adaDepositTxId)
      } catch (error: any){
        console.error(`error on init AOT contract ${error.message}`)
        return sfailure(error.message)
      } 
    }

    async sendReservedAdventurersToBuyer(contractId: string, cartId: string){
      try {
        const cart = await AotCartDSL.get(cartId)
        if(!cart) throw new Error("Could not find cart by id")
        const tokens = cart.assets.map(token => {return {asset: token, quantity: "1"}})
        const sellerAOTDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractId, this.changeAddress, tokens)
        if (sellerAOTDepositTX.ctype !== "success") throw new Error("Failed to geenrate AOT deposit transaction")
        const signedTxResult = await this.marloweDSL.signContractInteraction(sellerAOTDepositTX.textEnvelope.cborHex)
        if (signedTxResult.ctype !== "success") throw new Error("Failed to sign AOT deposit transaction")
        const submitResult = await this.marloweDSL.submitContractInteraciton(signedTxResult.signedTx, contractId, cart.adaDepositTxId)
      }
      catch(error: any){
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