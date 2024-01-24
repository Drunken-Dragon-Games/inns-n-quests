import { CardanoTransactionInfo } from "../../service-blockchain/models";
import { LoggingContext } from "../../tools-tracing";
import { OrderState, RefoundState, SuportedWallet, Token } from "../models";
import { AOTStoreOrder, CreateAOTOrder } from "./aot-order-db";

export type OrderInfo = {
    orderId: string
    buyerAddress: string
    adaDepositTx: CardanoTransactionInfo | null
    assetsDepositTx: CardanoTransactionInfo | null
    refoundTx: CardanoTransactionInfo | null
    assets: Token[] | null
    orderState: OrderState
    createdAt: string
    refoundState: RefoundState
}
export class AotOrdersDSL {
    static async create (info: CreateAOTOrder){ return (await AOTStoreOrder.create(info)).orderId}

    //this migth be dumb
    static async get(orderId: string): Promise<OrderInfo | null>{
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return null
        return {
            orderId: order.orderId,
            buyerAddress: order.buyerAddress,
            adaDepositTx: order.adaDepositTx,
            assetsDepositTx: order.assetsDepositTx,
            refoundTx: order.refoundTx,
            assets: order.assets,
            orderState: order.orderState,
            createdAt: order.createdAt,
            refoundState: order.refoundState
          } 
    }

    static async updateOrder(orderId: string, state: OrderState, refound?: RefoundState){
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return null
        order.orderState = state
        if(refound) order.refoundState = refound
        await order.save()
    }

    /* static async getOrdersForUser(userId: string): Promise<OrderInfo[]>{
        const orders = await AOTStoreOrder.findAll({where: {userId: userId}})
        return orders.map(order => ({ ...order.get() }))
    } */

    static async revertStaleOrders(orderTTL: number,logger?: LoggingContext): Promise<{staleAssets: Token[],  ordersReverted: number}>{
        //TODO: fix
        const activeOrders = await AOTStoreOrder.findAll({ where: { orderState: "created" }})
        const staleAssets = []
        let ordersReverted = 0
        for (const order of activeOrders) {
			const timePassed = (Date.now() - Date.parse(order.createdAt))
			if (timePassed > orderTTL*1000) {
                ordersReverted += 1
				order.orderState = "ada_deposit_timedOut"
                if (order.assets) staleAssets.push(...order.assets)
                await order.save()
				logger?.log.info({ message: "AotOrdersDSL.revertStaleOrders:timed-out", orderId: order.orderId})
			}
		}
        return {staleAssets, ordersReverted}
    }

    static async reverStaleOrder(orderId: string, logger?: LoggingContext): Promise<Token[]>{
        //TODO: fix
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return []
        order.orderState = "ada_deposit_timedOut"
        await order.save()
        return order.assets ?? []
    }
}
