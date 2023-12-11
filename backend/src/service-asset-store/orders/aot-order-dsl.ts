import { AOTStoreOrder, CreateAOTOrder } from "./aot-order-db";

export class AotOrdersDSL {
    static async create (info: CreateAOTOrder){ return (await AOTStoreOrder.create(info)).orderId}

    static async get(orderId: string){return AOTStoreOrder.findByPk(orderId)}
}