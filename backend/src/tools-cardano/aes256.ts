import crypto from "crypto"

export class AES256 {

	private key: Buffer

	constructor(options: { salt: crypto.BinaryLike, password: crypto.BinaryLike }) {
		this.key = crypto.scryptSync(options.password, options.salt, 32)
		console.log(this.key.toString('hex'))
	}

	encrypt(text: string): string {
		const iv = crypto.randomBytes(16)
		const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv)
		let encrypted = cipher.update(text)
		encrypted = Buffer.concat([encrypted, cipher.final()])
		return JSON.stringify({ iv: iv.toString('hex'), d: encrypted.toString('hex') })
	}

	decrypt(text: string): string {
		const ivd = JSON.parse(text) as { iv: string, d: string }
		const iv = Buffer.from(ivd.iv, 'hex')
		const encryptedText = Buffer.from(ivd.d, 'hex')
		const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv)
		let decrypted = decipher.update(encryptedText)
		decrypted = Buffer.concat([decrypted, decipher.final()])
		return decrypted.toString()
	}
}
