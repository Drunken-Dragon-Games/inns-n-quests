import { CardanoNetwork, AES256, Wallet, cardano } from "../../tools-cardano"
import cbor from "cbor"
import { NativeScript, Transaction, TransactionWitnessSet } from "@emurgo/cardano-serialization-lib-nodejs";

export type RegistryCache = 
    { [policyId: string]: 
        { signer: Wallet, policy: NativeScript } 
    }

export default class Registry {

    private aes256: AES256
    private cache: RegistryCache = {}

    constructor(private network: CardanoNetwork, options: { salt: string, password: string }){
        this.aes256 = new AES256(options)
    }

    public addToCache(wallet: Wallet, script: NativeScript): void {
        this.cache[cardano.policyId(script)] = { signer: wallet, policy: script }
    }

    public getCache(): RegistryCache {
        return this.cache
    }

    public async importCache(data: string): Promise<void> {
        const cborHash = this.aes256.decrypt(data)
        const undecoded = (await cbor.decodeFirst(cborHash)) as { [policyId: string]: { signer: string, policy: string } }
        for (const k in undecoded)
            this.cache[k] = { 
                signer: await Wallet.importWallet(this.network, undecoded[k].signer), 
                policy: NativeScript.from_bytes(await cbor.decodeFirst(undecoded[k].policy)) 
            }
    }

    public async exportCache(): Promise<string> {
        const encoded: { [policyId: string]: { signer: string, policy: string } } = {}
        for (const k in this.cache) 
            encoded[k] = { 
                signer: this.cache[k].signer.exportWallet(),
                policy: cbor.encode(this.cache[k].policy.to_bytes()).toString("hex")
            }
        const cborHash = cbor.encode(encoded).toString("hex")
        return this.aes256.encrypt(cborHash)
    }

    public policy(policyId: string): object | null {
        const policyOnCache = this.cache[policyId]
        if (policyId == undefined) return null
        else return policyOnCache.policy.to_js_value()
    }

    public signTx(policyId: string, transaction: Transaction): TransactionWitnessSet | null {
        const info = this.cache[policyId]
        if (info == undefined) return null
        else return info.signer.signTx(transaction)
    }

    public signWithPolicy(policyId: string, transaction: Transaction): TransactionWitnessSet | null {
        const info = this.cache[policyId]
        if (info == undefined) return null
        else return info.signer.signWithPolicy(transaction, info.policy)
    }

    public signData(policyId: string, payload: string): { signature: string, key: string } | null {
        const info = this.cache[policyId]
        if (info == undefined) return null
        else return info.signer.signData(payload)
    }
}
