import { LoggingContext } from "../tools-tracing";
import { SResult, sfailure, success } from "../tools-utils";
import { AotOrdersDSL } from "./orders/aot-order-dsl";
import { AOTInventory } from "./inventory/aot-invenotry-dsl";
import { MarloweDSl } from "./marlowe/marlowe-dsl";
import { CreateContractResponse } from "./marlowe/models";
import { ADA, CompensatingAction, OrderResponse, OrderStatusResponse, SubmitResponse, SuportedWallet, Token } from "./models";
import { AotStoreService } from "./service-spec";
import dotenv from "dotenv"
import { config } from "../tools-utils"
import { BlockchainService } from "../service-blockchain/service-spec";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

import * as aotOrderDB from "./orders/aot-order-db"
import * as aotInventoryDB from "./inventory/aot-invenotry-db"
import { QueryInterface, Sequelize } from "sequelize";
import { Umzug } from "umzug";
import path from "path";
import { buildMigrator } from "../tools-database";
import { AssetManagementService } from "../service-asset-management";
import { AssetStoreLogging } from "./service-loggin";
import { AssetStoreDsl } from "../service-asset-management/assets/assets-dsl";

export type AssetStoreServiceConfig = {
    inventoryAddress: string,
    AOTPrice: number,
    //marloweWebServerURl: string,
    AOTPolicy: string,
    txTTL: number,
}

export type AssetStoreDependencies = {
  blockchainService: BlockchainService, 
  blockfrost: BlockFrostAPI,
  database: Sequelize,
  assetManagementService: AssetManagementService
}

export class AssetStoreDSL implements AotStoreService {

  private readonly migrator: Umzug<QueryInterface>

  constructor(
      private readonly inventoryAddress: string,
      private readonly AOTPrice: number,
      //private readonly marloweDSL: MarloweDSl,
      private readonly database: Sequelize,
      private readonly blockchainService: BlockchainService,
      private readonly aotInventory: AOTInventory,
      private readonly txTTL: number,
      private readonly blockfrost: BlockFrostAPI
      ){
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
      }

  async loadDatabaseModels(): Promise<void>{
    aotOrderDB.configureSequelizeModel(this.database)
    aotInventoryDB.configureSequelizeModel(this.database)
    await this.migrator.up()
  }

  async unloadDatabaseModels(): Promise<void>{
    await this.migrator.down()
  }

  static async loadFromEnv( dependencies: AssetStoreDependencies): Promise<AotStoreService> {
    dotenv.config()
    return await AssetStoreDSL.loadFromConfig(
        { 
          inventoryAddress: config.stringOrError("THIOLDEN_INVENTORY_ADDRESS"), 
          AOTPrice: config.intOrError("THIOLDEN_ADA_PRICE"), 
          AOTPolicy: config.stringOrElse("POLICY_THIOLDEN", "e1c1e63f9d0143ebac802eba892f0ca66072d5c74c8cbcb197c8b95f"), 
          txTTL: config.intOrElse("ORDER_TX_TTL", 15 * 60),
        }, dependencies
      )
  }

  static async loadFromConfig(serviceConfig: AssetStoreServiceConfig, dependencies: AssetStoreDependencies): Promise<AotStoreService>{
    //const marloweDSL = new MarloweDSl(serviceConfig.marloweWebServerURl)
    
    const aotInventory = new AOTInventory(serviceConfig.AOTPolicy)
    const service = new AssetStoreLogging( new AssetStoreDSL(
      serviceConfig.inventoryAddress, 
      serviceConfig.AOTPrice,
      dependencies.database,
      dependencies.blockchainService, 
      aotInventory, 
      serviceConfig.txTTL,
      dependencies.blockfrost
      ))

      await service.loadDatabaseModels()

      if(await AOTInventory.isEmpty()) {
        console.log("Stocking empty inventory for asset store...")
        const inventoryResponse = await dependencies.assetManagementService.listChainAssetsByAddress([serviceConfig.inventoryAddress], [serviceConfig.AOTPolicy])
        if(inventoryResponse.status !== "ok") throw new Error("coudl not stock AOT inventory DB, could not get chain assets") 
        const stock = inventoryResponse.inventory[serviceConfig.AOTPolicy].map(aot => aot.unit)
        await AOTInventory.stockInventory(stock)
      }
      return service
  }

  async reserveAndGetAssetsSellTx(address: string, quantity: number, userId: string, logger?: LoggingContext): Promise<OrderResponse>{
    const compensatingActions: CompensatingAction[] = []
    try {
      if (quantity < 1 || !Number.isInteger(quantity)) throw new Error("invalid quantity of adventurers")
      const adaQuantity = quantity * this.AOTPrice
      const reservedItems = await this.aotInventory.reserveAssets(quantity)
      if (reservedItems.ctype !== "success") throw new Error(reservedItems.error)
      compensatingActions.push({ command: "release assets", assets: reservedItems.tokens })
      const assetsInfo = reservedItems.tokens.map(token => {return { policyId: token.currency_symbol, publicAssetName: token.token_name, amount: 1}})
      const sellInfo = await this.blockchainService.buildAssetsSellTx(address, this.inventoryAddress, assetsInfo,adaQuantity)
      if (sellInfo.status !== "ok") throw new Error("Failed to generate sell transaction")
      const orderId = await AotOrdersDSL.create({buyerAddress: address, userId, adaDepositTxId: sellInfo.value.txHash, assets: reservedItems.tokens})
      return success({orderId, tx: sellInfo.value.rawTransaction})
    } 
    catch (error: any) {
      await this.rollbackSaga(compensatingActions)
      logger?.log.error(`error reserving AOT assets ${error.message}`)
      console.error(`error reserving AOT assets ${error.message}`)
      return sfailure(error.message)
    }
  }

  async submitAssetsSellTx(orderId: string, serializedSignedTx: string, logger?: LoggingContext): Promise<SubmitResponse>{
    const orderInfo = await AotOrdersDSL.get(orderId)
    if (orderInfo == null) 
			return sfailure("unknown-order")
    if (orderInfo.orderState == "order_timed_out") 
			return sfailure("order-timed-out")
    if (orderInfo.orderState == "order_submition_failed") 
			return sfailure("order-submition-failed")
		if (orderInfo.orderState == "order_completed" || orderInfo.orderState == "transaction_submited") 
			return sfailure("order-already-completed")

    const txHash = await this.blockchainService.getTxHashFromTransaction(serializedSignedTx)
    if(txHash.status !== "ok") return sfailure(`could not verify TxHash: ${txHash.reason}`)
		if (txHash.value != orderInfo.adaDepositTxId) return sfailure("corrupted-tx")

    const txIdResponse = await this.blockchainService.submitTransaction(serializedSignedTx)
   
		if (txIdResponse.status !== "ok") {
      await this.aotInventory.releaseReservedAssets(orderInfo.assets)
      await AotOrdersDSL.updateOrder(orderId, "order_submition_failed")
      return sfailure(`TX not submitted: ${txIdResponse.reason} `)
    }
    AotOrdersDSL.updateOrder(orderId, "transaction_submited")
		logger?.log.info({ message: "AssetStoreService.submitAssetsSellTx:submitted", orderId: orderInfo.orderId, assets: JSON.stringify(orderInfo.assets) })
		return success({ txId: txIdResponse.value })
  }

  async revertStaleOrders(logger?: LoggingContext): Promise<number>{
    const {staleAssets, ordersReverted} = await AotOrdersDSL.revertStaleOrders(this.txTTL, logger)
    await this.aotInventory.releaseReservedAssets(staleAssets)
    return ordersReverted
  }

  async updateOrderStatus(orderId: string, logger?: LoggingContext): Promise<OrderStatusResponse>{
    const order = await AotOrdersDSL.get(orderId)
    if (order == null) return sfailure("unknown-order")
    if(order.orderState !== "transaction_submited" && order.orderState !== "created") return success({ status: order.orderState })
    const inBlockchain = await (async () => {
      try { await this.blockfrost.txs(order.adaDepositTxId); return true }
      catch (_) { return false }
    })()
    if (inBlockchain) {
      AotOrdersDSL.updateOrder(order.orderId, "order_completed")
      logger?.log.info({ message: "AssetStoreService.updateOrderStatus:confirmed", orderId })
      return success({ status: "order_completed" })
    }
    else{
      const timePassed = (Date.now() - Date.parse(order.createdAt))
      if (timePassed > this.txTTL*1000) {
				const staleAssets = await AotOrdersDSL.reverStaleOrder(orderId)
        await this.aotInventory.releaseReservedAssets(staleAssets)
				logger?.log.info({ message: "AssetStoreService.updateOrderStatus:timed-out", orderId })
        return success({ status: "order_timed_out" })
			}
    }
    return success({ status: order.orderState })
  }

  /* //FIXME: I should propably split this into a funciton to initializes the contract and another one to generate the buyer TX
  async initAOTContract(userId: string, browserWallet: SuportedWallet, buyerAddress: string, quantity: number, logger?: LoggingContext): Promise<SResult<{ contractId: string, depositTx: string, orderId: string }>> {
      const compensatingActions: CompensatingAction[] = []
      try {
        const reservedItems = await this.aotInventory.reserveAssets(quantity)
        compensatingActions.push({ command: "release assets", assets: reservedItems })
        const contractInfoResult = await this.marloweDSL.genInitContractTx(buyerAddress, this.inventoryAddress, reservedItems)
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
        //TODO: add more info to complete the TX screen
        return success({ contractId: contractId, depositTx: buyerAdaDepositTX.textEnvelope.cborHex, orderId })
      } catch (error: any) {
        await this.rollbackSaga(compensatingActions)
        console.error(`error on init AOT contract ${error.message}`)
        return sfailure(error.message)
      }
    } */
    
  /* async submitSignedContactInteraction(signedTx: string, contractId: string, orderId: string){
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
  } */

  /* async sendReservedAdventurersToBuyer(contractId: string, orderId: string){
    try {
      const order = await AotOrdersDSL.get(orderId)
      if(!order) throw new Error("Could not find order by id")
      const tokens = order.assets.map(token => {return {asset: token, quantity: "1"}})
      const sellerAOTDepositTX = await this.marloweDSL.genDepositIntoContractTX(contractId, this.inventoryAddress, tokens)
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
  } */

  async getAllUserOrders(userId: string){
    return AotOrdersDSL.getOrdersForUser(userId)
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
        /* case "retrive assets":
          return this.marloweDSL.retriveAssetsFromContract() */
        default:
          return Promise.resolve()
      }
    }
}