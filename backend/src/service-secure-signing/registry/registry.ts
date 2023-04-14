import { CardanoNetwork, AES256, Wallet, cardano } from "../../tools-cardano"
import cbor from "cbor"
import { NativeScript, Transaction, TransactionWitnessSet } from "@emurgo/cardano-serialization-lib-nodejs";
import { Lucid, C as LucidCore, Provider as LucidProvider, TransactionWitnesses, TxComplete } from "lucid-cardano"

export type RegistryCache = 
    { [policyId: string]: 
        { signer: Wallet, policy: NativeScript } 
    }

export default class Registry {

    private aes256: AES256
    private cache: RegistryCache = {}

    constructor(
        private network: CardanoNetwork, 
        options: { salt: string, password: string }
    ){
        this.aes256 = new AES256(options)
    }

    public async addToCache(wallet: Wallet, script: NativeScript): Promise<void> {
        const signer = wallet
        this.cache[cardano.policyId(script)] = { signer, policy: script }
    }

    public getCache(): RegistryCache {
        return this.cache
    }

    public async importCache(data: string): Promise<void> {
        const cborHash = this.aes256.decrypt(data)
        const undecoded = (await cbor.decodeFirst(cborHash)) as { [policyId: string]: { signer: string, policy: string } }
        for (const k in undecoded) {
            const signer = await Wallet.importWallet(this.network, undecoded[k].signer)
            this.cache[k] = { 
                signer, 
                policy: NativeScript.from_bytes(await cbor.decodeFirst(undecoded[k].policy)) 
            }
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

    public async lucidSignTx(policyId: string, transaction: TxComplete): Promise<TransactionWitnesses | null> {
        const info = this.cache[policyId]
        if (info == undefined) return null
        else return transaction.partialSignWithPrivateKey(info.signer.paymentPvtKey.to_bech32()) 
    }
}
