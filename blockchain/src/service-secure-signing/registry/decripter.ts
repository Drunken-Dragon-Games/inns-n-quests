import { Resolution } from "../../utypes.ts"
import cbor from "npm:cbor@8.1.0"
import {PrivateKey} from "npm:@emurgo/cardano-serialization-lib-nodejs"

export type MnemonicRecovery = 
    { ctype: "mnemonic", mnemonic: string, password: string }
export type FilesRecovery = 
    { ctype: "files", payment: {cborHex: string}, stake: {cborHex: string} }
export type RegistryWalletRecovery = 
    MnemonicRecovery | FilesRecovery

export class RegistryDecrypter {

    private static async loadBech32PvkFromJson(json: { payment: {cborHex: string}, stake: {cborHex: string} }): Promise<string> {
        return PrivateKey.from_normal_bytes(await cbor.decodeFirst(json.payment.cborHex)).to_bech32()
    }

    static async importPrvKey(cborHex: string): Promise<Resolution<string>> {
        const recovery = (await cbor.decode(cborHex)) as RegistryWalletRecovery
        if (recovery.ctype == "files") return {status: "ok", value: (await RegistryDecrypter.loadBech32PvkFromJson(recovery))}
        else return {status: "invalid", reason: "Only files type recoverys allowed for now."}
    }
}