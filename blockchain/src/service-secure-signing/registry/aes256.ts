import {decode} from "https://deno.land/std@0.192.0/encoding/hex.ts"

const strToUint8=(s:string)=>new TextEncoder().encode(s)
const uint8ToStr=(d:Uint8Array)=>new TextDecoder().decode(d)

export class AES256 {
	constructor(private key: CryptoKey) {}

	static async load(storedKey: string): Promise<AES256> {
		const rawKey = decode(strToUint8(storedKey))
		const key = await crypto.subtle.importKey("raw", rawKey.buffer, "AES-CBC", true, ["encrypt", "decrypt"])
		return new AES256(key)
	}

	async decrypt(text: string): Promise<string> {
		const ivd = JSON.parse(text) as { iv: string, d: string }
		const iv = decode(strToUint8(ivd.iv))
		const decrypted = await crypto.subtle.decrypt({name: "AES-CBC", iv}, this.key, decode(strToUint8(ivd.d)))
		return uint8ToStr(new Uint8Array(decrypted))
	}

}
