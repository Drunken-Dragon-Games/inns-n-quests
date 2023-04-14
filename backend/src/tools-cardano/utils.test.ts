import { AES256 } from "./aes256.js"
import { UtxoLike, cardano } from "./utils.js"

const utxo = (amount: { unit: string, quantity: string }[]): UtxoLike => {
    return { tx_index: 0, tx_hash: "0", amount, block: "0" }
}

const amount = (unit: string, quantity: string): { unit: string, quantity: string } => {
    return { unit, quantity }
}

const utxo1 = utxo([amount("lovelace", "100"), amount("mytoken", "100")])
const utxo2 = utxo([amount("lovelace", "300"), amount("mytoken", "50")])
const utxo3 = utxo([amount("lovelace", "200"), amount("mytoken", "10")])
const utxo4 = utxo([amount("lovelace", "1000")])
const input = [utxo1,utxo2,utxo3,utxo4]

test("utxo sort: lovelace", () => {
    const sorted = cardano.sortUtxos(input, "lovelace")
    expect(sorted).toStrictEqual([utxo4,utxo2,utxo3,utxo1])
})

test("utxo sort: mytoken", () => {
    const sorted = cardano.sortUtxos(input, "mytoken")
    expect(sorted).toStrictEqual([utxo1,utxo2,utxo3,utxo4])
})

test("largestFirstCSA: lovelace 1", () => {
    const t1 = cardano.largestFirstCSA(BigInt(600), "lovelace", input)
    expect(t1).toStrictEqual([utxo4])
})

test("largestFirstCSA: lovelace 2", () => {
    const t1 = cardano.largestFirstCSA(BigInt(1200), "lovelace", input)
    expect(t1).toStrictEqual([utxo4, utxo2])
})

test("largestFirstCSA: mytoken 1", () => {
    const t1 = cardano.largestFirstCSA(BigInt(60), "mytoken", input)
    expect(t1).toStrictEqual([utxo1])
})

test("largestFirstCSA: mytoken 2", () => {
    const t1 = cardano.largestFirstCSA(BigInt(110), "mytoken", input)
    expect(t1).toStrictEqual([utxo1, utxo2])
})

test("largestFirstCSA: insufficient-balance 1", () => {
    expect(() => cardano.largestFirstCSA(BigInt(1000), "mytoken", input)).toThrowError("insufficient-balance")
})

test("largestFirstCSA: insufficient-balance 2", () => {
    expect(() => cardano.largestFirstCSA(BigInt(2000), "lovelace", input)).toThrowError("insufficient-balance")
})

test("Encrypt: ok", () => {
    const aes256 = new AES256({ salt: "salt", password: "password" })
    const encrypted = aes256.encrypt("hola")
    const decrypted = aes256.decrypt(encrypted)
    expect(decrypted).toBe("hola")
})

test("Encrypt: bad 1", () => {
    const aes256_1 = new AES256({ salt: "salt1", password: "password" })
    const aes256_2 = new AES256({ salt: "salt2", password: "password" })
    const encrypted = aes256_1.encrypt("hola")
    expect(() => aes256_2.decrypt(encrypted)).toThrow(new RegExp("(.+)bad decrypt"))
})

test("Encrypt: bad 2", () => {
    const aes256_1 = new AES256({ salt: "salt", password: "password1" })
    const aes256_2 = new AES256({ salt: "salt", password: "password2" })
    const encrypted = aes256_1.encrypt("hola")
    expect(() => aes256_2.decrypt(encrypted)).toThrow(new RegExp("(.+)bad decrypt"))
})