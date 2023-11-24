import { AOTStoreCart, CreateAOTCart } from "./aot-cart-db";

export const create = async (info: CreateAOTCart) => AOTStoreCart.create(info)