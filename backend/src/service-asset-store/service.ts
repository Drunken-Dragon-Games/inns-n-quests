import { LoggingContext } from "../tools-tracing";
import { SResult, sfailure, success } from "../tools-utils";
import { AotOrdersDSL } from "./orders/aot-order-dsl";
import { AOTInventory } from "./inventory/aot-invenotry-dsl";
import { MarloweDSl } from "./marlowe/marlowe-dsl";
import { CreateContractResponse } from "./marlowe/models";
import { ADA, CompensatingAction, SuportedWallet, Token } from "./models";
import { AssetStoreDSL } from "./service-spec";
import dotenv from "dotenv"
import { config } from "../tools-utils"

export type AssetStoreServiceConfig = {
    changeAddress: string,
    AOTPrice: number,
    marloweWebServerURl: string,
    AOTPolicy: string
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

  static async loadFromEnv(): Promise<AssetStoreService> {
    dotenv.config()
    return await AssetStoreService.loadFromConfig(
        { changeAddress: config.stringOrError("CARDANO_NETWORK")
        , AOTPrice: config.intOrError("DISCORD_CLIENT_ID")
        , marloweWebServerURl: config.stringOrElse("IDENTITY_SERVICE_SESSIONS_DURATION", "https://marlowe-runtime-preprod-web.scdev.aws.iohkdev.io")
        , AOTPolicy: config.stringOrElse("IDENTITY_SERVICE_SESSIONS_DURATION", "e1c1e63f9d0143ebac802eba892f0ca66072d5c74c8cbcb197c8b95f")
        })
  }

  static async loadFromConfig(serviceConfig: AssetStoreServiceConfig): Promise<AssetStoreService>{
    const marloweDSL = new MarloweDSl(serviceConfig.marloweWebServerURl)
    const aotInventory = new AOTInventory(serviceConfig.AOTPolicy)
    return new AssetStoreService(serviceConfig.changeAddress, serviceConfig.AOTPrice, marloweDSL, aotInventory)
  }

  //FIXME: I should propably split this into a funciton to initializes the contract and another one to generate the buyer TX
  async initAOTContract(userId: string, browserWallet: SuportedWallet, buyerAddress: string, quantity: number, logger?: LoggingContext): Promise<SResult<{ contractId: string, depositTx: string, orderId: string }>> {
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
        await this.aotInventory.reserveUnder(reservedItems, contractId)
        const adaQuantity = (quantity * this.AOTPrice).toString()
        const buyerAdaDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractId, buyerAddress, [{asset: ADA, quantity: adaQuantity}])
        if (buyerAdaDepositTX.ctype !== "success") throw new Error("Failed to geenrate ADA deposit transaction")
        const orderId = await AotOrdersDSL.create({buyerAddress, userId, browserWallet, adaDepositTxId: buyerAdaDepositTX.transactionId, assets: reservedItems, contractId})
        return success({ contractId: contractId, depositTx: buyerAdaDepositTX.textEnvelope.cborHex, orderId })
      } catch (error: any) {
        await this.rollbackSaga(compensatingActions)
        console.error(`error on init AOT contract ${error.message}`)
        return sfailure(error.message)
      }
    }
    
  async submitSignedContactInteraction(signedTx: string, contractId: string, orderId: string){
    try {
      const order = await AotOrdersDSL.get(orderId)
      if(!order) throw new Error("Could not find order by id")
      //TODO: check the client types
      const submitResult = await this.marloweDSL.submitContractInteraciton(signedTx, contractId, order.adaDepositTxId)
      await AotOrdersDSL.updateOrder(order.orderId, "transaction_confirmed")
    } catch (error: any){
      console.error(`error on init AOT contract ${error.message}`)
      return sfailure(error.message)
    } 
  }

  async sendReservedAdventurersToBuyer(contractId: string, orderId: string){
    try {
      const order = await AotOrdersDSL.get(orderId)
      if(!order) throw new Error("Could not find order by id")
      const tokens = order.assets.map(token => {return {asset: token, quantity: "1"}})
      const sellerAOTDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractId, this.changeAddress, tokens)
      if (sellerAOTDepositTX.ctype !== "success") throw new Error("Failed to geenrate AOT deposit transaction")
      const signedTxResult = await this.marloweDSL.signContractInteraction(sellerAOTDepositTX.textEnvelope.cborHex)
      if (signedTxResult.ctype !== "success") throw new Error("Failed to sign AOT deposit transaction")
      const submitResult = await this.marloweDSL.submitContractInteraciton(signedTxResult.signedTx, contractId, order.adaDepositTxId)
      await AotOrdersDSL.updateOrder(order.orderId, "order_completed")
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