import { AOTStoreCart, CreateAOTCart } from "./aot-cart-db";
//TODO: change the name cus i dont love this being referd to as "cart"
export class AotCartDSL {
    static async create (info: CreateAOTCart){ return (await AOTStoreCart.create(info)).cartId}
}