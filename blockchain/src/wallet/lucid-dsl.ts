import { Lucid, Blockfrost } from "https://deno.land/x/lucid@0.10.6/mod.ts"
import { Resolution, succed, fail, Network } from "../utypes.ts"
import { stringOrError } from "../utils.ts";

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
            console.log(`coudl initiate lucid`)
            const tx = this.lucidInstance.newTx().payToAddress(address, {lovelace: BigInt(1000000)})
            console.log(`generated tx`)
            const completTx = await tx.complete()
            console.log(`completed tx`)
            const txHash = completTx.toString()
            /* const txHash = await tx.toString() */
            console.log("backend geenratred this tx hash")
            console.log(txHash)
            return succed(txHash)
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
        } 
}   
