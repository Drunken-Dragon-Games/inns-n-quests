import { Lucid, cbor } from "../../../deps.ts"
import { Resolution } from "../../utypes.ts"
import { AES256 } from "./aes256.ts"

type PrivateKeyBech32 = string
export type RegistryCache = {[policyId: string]: {privateKey: PrivateKeyBech32, mintingPolicy: Lucid.Script}}

export default class Registry {
    private cache: RegistryCache = {}

    constructor( private lucidFactory: () => Promise<Lucid.Lucid>, private aes256: AES256){}

    public getCache(): RegistryCache {
        return this.cache
    }

    public async importCache(data: string): Promise<void> {
        const cborHash = await this.aes256.decrypt(data)
        const registry = cbor.decode(cborHash) as RegistryCache
        for (const policyId  in registry) {
            this.cache[policyId] = {privateKey:registry[policyId].privateKey, mintingPolicy: registry[policyId].mintingPolicy }
        }
    }

    public async signWithPolicy(policyId: string, transaction: Lucid.Transaction): Promise<Resolution<string>>{
        const info = this.cache[policyId]
        if (info == undefined) return {status: "invalid", reason: "could not find policy in registry"}
        const lucidInstance = await this.lucidFactory()
        lucidInstance.selectWalletFromPrivateKey(info.privateKey)
        const tx = lucidInstance.fromTx(transaction)
        const signedTx = await tx.sign().complete()
        return {status:"ok", value: signedTx.toString()}
    }

    public policy(policyId: string): Resolution<Lucid.Script> {
        const info = this.cache[policyId]
        if (info == undefined) return {status: "invalid", reason: "could not find policy in registry"}
        return {status: "ok", value: info.mintingPolicy}
    }

}
 