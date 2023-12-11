import { OrderState } from "../models";
import { AOTStoreOrder, CreateAOTOrder } from "./aot-order-db";


export class AotOrdersDSL {
    static async create (info: CreateAOTOrder){ return (await AOTStoreOrder.create(info)).orderId}

    //this migth be dumb
    static async get(orderId: string){
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return null
        return {
            orderId: order.orderId,
            userId: order.userId,
            buyerAddress: order.buyerAddress,
            adaDepositTxId: order.adaDepositTxId,
            assets: order.assets,
            contractId: order.contractId,
            browserWallet: order.browserWallet,
            orderState: order.orderState,
          } 
    }

    static async updateOrder(orderId: string, state: OrderState){
        const order = await AOTStoreOrder.findByPk(orderId)
        if(!order) return null
        order.orderState = state
        await order.save()
    }
}