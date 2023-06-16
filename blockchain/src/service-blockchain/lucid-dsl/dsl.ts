import { Lucid} from "https://deno.land/x/lucid@0.10.6/mod.ts"
import { Resolution, succed, fail } from "../../utypes.ts"
import { CardanoTransactionInfo } from "../models.ts"

const validityRange = 1000 * 60 * 10

export class LucidDsl {
    constructor(public lucidInstance: Lucid){}
    //TODO: clean this up hehe
    buildSelfTx = async (address: string): Promise<Resolution<CardanoTransactionInfo>> => {
        try{
            this.lucidInstance.selectWalletFrom({ address })
            const now = Date.now()
            const validFrom = now - validityRange
            const validTo = now + validityRange

            const currentSlot = this.lucidInstance.utils.unixTimeToSlot(now)
            
            //you might be wondering
            //were did the 540 come from
            //so do i
            //but every tx ive tested has come with an actual invalid_before slot that is off by 540
            const validFromSlot = `${currentSlot - (validityRange / 10000) - 540}`
            const validToSlot = `${currentSlot + (validityRange/ 1000)}`
            const amountTransferred = "3200000"
            const tx = await this.lucidInstance.newTx()
                .payToAddress(address, {lovelace: BigInt(amountTransferred)})
                .validFrom(validFrom)
                .validTo(validTo)
                .complete()
            const rawTransaction = tx.toString()

            console.log({validFrom, validTo})
            console.log({validFromSlot, validToSlot})

            return succed({rawTransaction, validFromSlot, validToSlot, amountTransferred})
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
        } 
}   
