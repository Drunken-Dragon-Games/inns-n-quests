import { LoggingContext } from "../tools-tracing"
import { SResult, Unit } from "../tools-utils"
import { OrderResponse, OrderStatusResponse, SubmitResponse, SuportedWallet } from "./models"

export interface AotStoreService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    //initAOTContract(userId: string, browserWallet: SuportedWallet, buyerAddres: string, quantity: number, logger?: LoggingContext): Promise<SResult<{contractId: string}>>

    reserveAndGetAssetsSellTx(address: string, quantity: number, userId: string, logger?: LoggingContext): Promise<OrderResponse>

    submitAssetsSellTx(orderId: string, serializedSignedTx: string, logger?: LoggingContext): Promise<SubmitResponse>

    updateOrderStatus(orderId: string, logger?: LoggingContext): Promise<OrderStatusResponse>

    revertStaleOrders(logger?: LoggingContext): Promise<number>
}
