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

    buildSelfTx = async (stakeAddress: string): Promise<Resolution<string>> => {
        try{
            this.lucidInstance.selectWalletFrom({ address: stakeAddress })
            const txHash = await this.lucidInstance.newTx().payToAddress(stakeAddress, {lovelace: BigInt(1000000)}).complete()
            console.log(txHash.toString())
            return succed(txHash.toString())
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
        } 
}   
