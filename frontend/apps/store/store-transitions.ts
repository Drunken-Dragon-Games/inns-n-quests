import { SupportedWallet } from "../account";
import { StoreStore } from "./store-state";
import { StoreThunks } from "./store-thunks";

const dispatch = StoreStore.dispatch

export const storeTranstions = {
    orderAOts:(wallet: SupportedWallet, quantity:string) => {
        dispatch(StoreThunks.orderAOTs(wallet, quantity))
    }
}