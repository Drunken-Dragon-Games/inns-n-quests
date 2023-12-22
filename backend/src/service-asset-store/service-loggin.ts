import { LoggingContext } from "../tools-tracing";
import { OrderResponse, OrderStatusResponse, SubmitResponse } from "./models";
import { AotStoreService } from "./service-spec";

export class AssetStoreLogging implements AotStoreService {

    constructor(private base: AotStoreService) {}

    private withComponent(logger?: LoggingContext): LoggingContext | undefined {
        return logger?.withComponent("aot-store-service")
    }

    async loadDatabaseModels(): Promise<void> { 
        await this.base.loadDatabaseModels() 
    }

    async unloadDatabaseModels(): Promise<void> { 
        await this.base.unloadDatabaseModels() 
    }

    async reserveAndGetAssetsSellTx(address: string, quantity: number, userId: string, logger?: LoggingContext): Promise<OrderResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`Reserving ${quantity} assets for address ${address}`)
        const response = await this.base.reserveAndGetAssetsSellTx(address, quantity, userId, logger)
        if(response.ctype !== "success")
            serviceLogger?.log.error(`Could not reserve assets becaouse: ${response.error}`)
        else
            serviceLogger?.log.info(`Succesfully reseved assets with order ${response.orderId}`)
        return response
    }
    async submitAssetsSellTx(orderId: string, serializedSignedTx: string, logger?: LoggingContext | undefined): Promise<SubmitResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`submiting order ${orderId}`)
        const response = await this.base.submitAssetsSellTx(orderId, serializedSignedTx, logger)
        if(response.ctype !== "success")
            serviceLogger?.log.error(`Could not submit order ${orderId} becaouse: ${response.error}`)
        else
            serviceLogger?.log.info(`Succesfully submited order ${orderId} under tx ${response.txId}`)
        return response
    }
    
    async updateOrderStatus(orderId: string, logger?: LoggingContext | undefined): Promise<OrderStatusResponse> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.updateOrderStatus(orderId, logger)
        if(response.ctype !== "success")
            serviceLogger?.log.error(`Could not find order ${orderId}`)
        else if(response.status == "order_completed")
            serviceLogger?.log.info(`Succesfully completed order ${orderId}`)
        else if(response.status == "order_timed_out")
            serviceLogger?.log.info(`Order ${orderId} timed out`)
        return response
    }

    revertStaleOrders(logger?: LoggingContext | undefined): Promise<number> {
        const serviceLogger = this.withComponent(logger)
        return this.base.revertStaleOrders(serviceLogger)
    }
}