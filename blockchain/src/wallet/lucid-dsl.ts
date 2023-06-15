import { Lucid, Blockfrost } from "https://deno.land/x/lucid@0.10.6/mod.ts"
import { Resolution, succed, fail, Network } from "../utypes.ts"
import { stringOrError } from "../utils.ts";

const validityRange = 1000 * 60 * 10

export class CardanoDsl {
    constructor(public lucidInstance: Lucid){}

    static async loadFromEnv(): Promise<CardanoDsl>{ 
        const projectId = await stringOrError("BLOCKFROST_API_KEY")
        const network: Network = await stringOrError("CARDANO_NETWORK")
        const blockfrostAPILink = network == "Mainnet" ? "https://cardano-mainnet.blockfrost.io/api/v0" : "https://cardano-preprod.blockfrost.io/api/v0"
        const lucid = await Lucid.new(new Blockfrost(blockfrostAPILink, projectId), network)
        return new CardanoDsl(lucid)
    }

    buildSelfTx = async (address: string): Promise<Resolution<string>> => {
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
            const validFromSlot = currentSlot - (validityRange / 10000) - 540
            const validToSlot = currentSlot + (validityRange/ 1000)
            const tx = await this.lucidInstance.newTx()
                .payToAddress(address, {lovelace: BigInt(1000000)})
                .validFrom(validFrom)
                .validTo(validTo)
                .complete()
            const txHash = tx.toString()

            console.log({validFrom, validTo})
            console.log({validFromSlot, validToSlot})

            return succed(txHash)
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
        } 
}   
