import { OrderState, SuportedWallet, Token } from "../models";
import { AOTStoreOrder, CreateAOTOrder } from "./aot-order-db";

type OrderInfo = {
    orderId: string
    userId: string
    buyerAddress: string
    adaDepositTxId: string
    assets: Token[]
    orderState: OrderState
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
}
