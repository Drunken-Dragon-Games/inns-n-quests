import { Lucid, Transaction } from "https://deno.land/x/lucid@0.10.6/mod.ts"

import cbor from "npm:cbor@8.1.0"
import { AES256 } from "./aes256.ts"
import { RegistryDecrypter } from "./decripter.ts"

type PrivateKeyBech32 = string
//keeping the record structure in case we whant to add the policy from the registry
export type RegistryCache = { [policyId: string]: { key: PrivateKeyBech32 } }

export default class Registry {

    private aes256: AES256
    private cache: RegistryCache = {}

    constructor( private lucidFactory: () => Promise<Lucid>, options: { salt: string, password: string }){
        this.aes256 = new AES256(options)
    }

    public getCache(): RegistryCache {
        return this.cache
    }

    public async importCache(data: string): Promise<void> {
        const cborHash = this.aes256.decrypt(data)
        const undecoded = (await cbor.decodeFirst(cborHash)) as { [policyId: string]: { signer: string, policy: string } }
        for (const k in undecoded) {
            const key = await RegistryDecrypter.importPrvKey(undecoded[k].signer)
            if (key.status !== "ok") throw new Error(`Error when decripting policy ${k}`)
            this.cache[k] = {key: key.value}
        }
    }

    public async signWithPolicy(policyId: string, transaction: Transaction): Promise<string | null>{
        const info = this.cache[policyId]
        if (info == undefined) return null
        const lucidInstance = await this.lucidFactory()
        lucidInstance.selectWalletFromPrivateKey(info.key)
        const tx = lucidInstance.fromTx(transaction)
        const signedTx = await tx.sign().complete()
        return signedTx.toString()
    }

}
 