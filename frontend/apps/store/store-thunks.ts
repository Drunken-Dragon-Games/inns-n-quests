import { AccountApi, SupportedWallet } from "../account";
import { StoreThunk, storeState } from "./store-state";

const actions = storeState.actions

export const StoreThunks = {
    orderAOTs: (supportedWallet: SupportedWallet): StoreThunk => async (dispatch) => {
        const walletResult = await AccountApi.getWallet(supportedWallet)
    }
}