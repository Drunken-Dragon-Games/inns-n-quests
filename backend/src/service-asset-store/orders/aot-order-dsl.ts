import { LoggingContext } from "../../tools-tracing";
import { OrderState, SuportedWallet, Token } from "../models";
import { AOTStoreOrder, CreateAOTOrder } from "./aot-order-db";

type OrderInfo = {
    orderId: string
    userId: string
    buyerAddress: string
    adaDepositTxId: string
    assets: Token[]
    orderState: OrderState
    createdAt: string
}
export class AotOrdersDSL {
    static async create (info: CreateAOTOrder){ return (await AOTStoreOrder.create(info)).orderId}

    //this migth be dumb
    static async get(orderId: string): Promise<OrderInfo | null>{
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return null
        return {
            orderId: order.orderId,
            userId: order.userId,
            buyerAddress: order.buyerAddress,
            adaDepositTxId: order.adaDepositTxId,
            assets: order.assets,
            orderState: order.orderState,
            createdAt: order.createdAt
          } 
    }

    static async updateOrder(orderId: string, state: OrderState){
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return null
        order.orderState = state
        await order.save()
    }

    static async getOrdersForUser(userId: string): Promise<OrderInfo[]>{
        const orders = await AOTStoreOrder.findAll({where: {userId: userId}})
        return orders.map(order => ({ ...order.get() }))
    }

    static async revertStaleOrders(orderTTL: number,logger?: LoggingContext): Promise<{staleAssets: Token[],  ordersReverted: number}>{
        const activeOrders = await AOTStoreOrder.findAll({ where: { orderState: "created" }})
        const staleAssets = []
        let ordersReverted = 0
        for (const order of activeOrders) {
			const timePassed = (Date.now() - Date.parse(order.createdAt))
			if (timePassed > orderTTL*1000) {
                ordersReverted += 1
				order.orderState = "order_timed_out"
                staleAssets.push(...order.assets)
                await order.save()
				logger?.log.info({ message: "AotOrdersDSL.revertStaleOrders:timed-out", orderId: order.orderId, userId: order.userId, tx: order.adaDepositTxId })
			}
		}
        return {staleAssets, ordersReverted}
    }

    static async reverStaleOrder(orderId: string, logger?: LoggingContext): Promise<Token[]>{
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return []
        order.orderState = "order_timed_out"
        await order.save()
        return order.assets
    }
}
