import { LoggingContext } from "../tools-tracing";
import { OrderResponse } from "./models";
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
            serviceLogger?.log.info(`Succesfully reseved assets`)
        return response
    }
}