import { Lucid, TxComplete } from "https://deno.land/x/lucid@0.10.6/mod.ts"
import { Resolution, succed, fail } from "../utypes.ts"

export const buildSelfTx = async (lucidInstance: Lucid): Promise<Resolution<string>> => {
    try{
        const receivingAddress = await lucidInstance.wallet.address()
        const tx = await lucidInstance.newTx().payToAddress(receivingAddress, {lovelace: BigInt(1000000)}).complete()
        return succed(tx.toString())
    }
    catch(e){
        return fail(e.message ?? JSON.stringify(e, null, 4))
    }
    }    

