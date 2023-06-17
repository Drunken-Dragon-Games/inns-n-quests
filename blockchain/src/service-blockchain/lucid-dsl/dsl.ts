import { Lucid, Transaction} from "https://deno.land/x/lucid@0.10.6/mod.ts"
import { Resolution, succed, fail } from "../../utypes.ts"
import { CardanoTransactionInfo, TransactionHashReponse, SubmitTransactionReponse } from "../models.ts"

const validityRange = 1000 * 60 * 10

export class LucidDsl {
    constructor(public lucidInstance: Lucid){}

    async buildSelfTx (address: string): Promise<Resolution<CardanoTransactionInfo>> {
        try{
            this.lucidInstance.selectWalletFrom({ address })
            const tx = await this.lucidInstance.newTx()
                .payToAddress(address, {lovelace: BigInt("1000000")})
                .complete()
            const rawTransaction = tx.toString()
            const txHash = tx.toHash()

            return succed({rawTransaction, txHash})
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
    }

    hashSerializedTransaction (serializedTrasnaction: Transaction): TransactionHashReponse {
        try{
            const tx = this.lucidInstance.fromTx(serializedTrasnaction)
            const txHash = tx.toHash()
            return {status: "ok", value: txHash}
        }catch(e){
            console.log(e)
            return {status: "invalid", reason: e.message ?? JSON.stringify(e, null, 4)}
        }
    }

    async submitSerializedTransaction (serializedTrasnaction: Transaction): Promise<SubmitTransactionReponse> {
        try{
            const tx = this.lucidInstance.fromTx(serializedTrasnaction)
            const signedTx = await tx.complete()
            const txHash = await signedTx.submit()
            
            return {status: "ok", value: txHash}
        }catch(e){
            console.log(e)
            return {status: "invalid", reason: e.message ?? JSON.stringify(e, null, 4)}
        }
    }
}   
