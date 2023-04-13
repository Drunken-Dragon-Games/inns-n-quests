import fs from "fs/promises"

import cbor from "cbor"
import { mnemonicToEntropy, generateMnemonic } from "bip39"
import { Address, BaseAddress, Bip32PrivateKey, Ed25519Signature, make_vkey_witness, NativeScript, NetworkInfo, PrivateKey, PublicKey, RewardAddress, ScriptPubkey, StakeCredential, Transaction, TransactionWitnessSet, Vkeywitness } from "@emurgo/cardano-serialization-lib-nodejs"
import { AlgorithmId, BigNum, CBORValue, COSEKey, COSESign1, COSESign1Builder, HeaderMap, Headers, Int, KeyType, Label, ProtectedHeaderMap } from "@emurgo/cardano-message-signing-nodejs"

import { cardano, CardanoNetwork } from "./utils"
import { Lucid, C as LucidCore} from "lucid-cardano"

export type MnemonicRecovery = 
    { ctype: "mnemonic", mnemonic: string, password: string }
export type FilesRecovery = 
    { ctype: "files", payment: {cborHex: string}, stake: {cborHex: string} }
export type WalletRecovery = 
    MnemonicRecovery | FilesRecovery

export class Wallet {

    public lucid: Lucid 

    constructor (
        public networkId: number,
        public stakePvtKey: PrivateKey,
        public stakePubKey: PublicKey,
        public paymentPvtKey: PrivateKey,
        public paymentPubKey: PublicKey,
        public recovery: WalletRecovery,
        lucid_: Lucid
    ){
        this.lucid = lucid_.selectWalletFromPrivateKey(this.paymentPvtKey.to_bech32())
    }

    static networkId = (network: CardanoNetwork): number => {
        if (network == "mainnet") return NetworkInfo.mainnet().network_id()
        else return NetworkInfo.testnet_preprod().network_id()
    }

    static generate(network: CardanoNetwork, password: string, lucid: Lucid): Wallet {
        return Wallet.recover(network, generateMnemonic(), password, lucid)
    }

    static recover(network: CardanoNetwork, mnemonicPhrase: string, password: string, lucid: Lucid): Wallet {
        const harden = (num: number): number => 0x80000000 + num
        const entropy = mnemonicToEntropy(mnemonicPhrase)
        const rootKey = Bip32PrivateKey
            .from_bip39_entropy(Buffer.from(entropy, "hex"), Buffer.from(password))
        const accountKeyBip32: Bip32PrivateKey = rootKey
            .derive(harden(1852)) // purpose
            .derive(harden(1815)) // coin type
            .derive(harden(0)) // account #0
        const paymentPvtKey = accountKeyBip32
            .derive(0) // external
            .derive(0)
            .to_raw_key()
        const stakePvtKey = accountKeyBip32
            .derive(2) // chimeric
            .derive(0)
            .to_raw_key()
        const recovery: WalletRecovery = { ctype: "mnemonic", mnemonic: mnemonicPhrase, password }
        return new Wallet(Wallet.networkId(network), stakePvtKey, stakePvtKey.to_public(), paymentPvtKey, paymentPvtKey.to_public(), recovery, lucid)
    }

    static async loadFromFiles(network: CardanoNetwork, paymentPath: string, stakePath: string, lucid: Lucid): Promise<Wallet> {
        const loadKeyFromFile = async (filepath: string): Promise<{cborHex: string}> => 
            JSON.parse(await fs.readFile(filepath, "utf8")) as {cborHex: string}
        return Wallet.loadFromJson(network, { payment: await loadKeyFromFile(paymentPath), stake: await loadKeyFromFile(stakePath) }, lucid)
    }

    static async loadFromJson(network: CardanoNetwork, json: { payment: {cborHex: string}, stake: {cborHex: string} }, lucid: Lucid): Promise<Wallet> {
        const paymentPrvKey = PrivateKey.from_normal_bytes(await cbor.decodeFirst(json.payment.cborHex))
        const paymentPubKey = paymentPrvKey.to_public()
        const stakePrvKey = PrivateKey.from_normal_bytes(await cbor.decodeFirst(json.stake.cborHex))
        const stakePubKey = stakePrvKey.to_public()
        const recovery: WalletRecovery = { ...json, ctype: "files"}
        return new Wallet(Wallet.networkId(network), stakePrvKey, stakePubKey, paymentPrvKey, paymentPubKey, recovery, lucid)
    }

    public exportWallet(): string {
        return cbor.encode(this.recovery).toString("hex")
    }

    static async importWallet(network: CardanoNetwork, cborHex: string): Promise<Wallet> {
        const recovery = (await cbor.decode(cborHex)) as WalletRecovery
        if (recovery.ctype == "files") return Wallet.loadFromJson(network, recovery)
        else return Wallet.recover(network, recovery.mnemonic, recovery.password)
    }

    public baseAddress: BaseAddress =
        BaseAddress.new(this.networkId,
            StakeCredential.from_keyhash(this.paymentPubKey.hash()),
            StakeCredential.from_keyhash(this.stakePubKey.hash()),
        )
    
    public stakeAddress: RewardAddress =
        RewardAddress.new(this.networkId,
            StakeCredential.from_keyhash(this.stakePubKey.hash()),
        )
    
    public buildPaymentWitness = (transaction: Transaction): Vkeywitness =>
        make_vkey_witness(cardano.hashTx(transaction), this.paymentPvtKey)

    public buildStakeWitness = (transaction: Transaction): Vkeywitness =>
        make_vkey_witness(cardano.hashTx(transaction), this.stakePvtKey)
    
    public signTx = (transaction: Transaction): TransactionWitnessSet => {
        const witness = this.buildPaymentWitness(transaction)
        const witnessSet = transaction.witness_set()
		return cardano.addWitnessToWitnesseSet(witness, witnessSet)
    }

    public signTxLucid = (transaction: LucidCore.Transaction) => {
        const witness = transaction.witness_set
    }

    public signWithPolicy(transaction: Transaction, policy: NativeScript): TransactionWitnessSet {
        const witness = this.buildPaymentWitness(transaction)
        const witnessSet = transaction.witness_set()
        const withNewWitness = cardano.addWitnessToWitnesseSet(witness, witnessSet)
        const withScript = cardano.addScriptToWitnessSet(policy, withNewWitness)
        return withScript
    }

    public signData(payload: string): { signature: string, key: string } {
        const address = this.stakeAddress.to_address().to_hex()
        const protectedHeaders = HeaderMap.new()
        protectedHeaders.set_algorithm_id(Label.from_algorithm_id(AlgorithmId.EdDSA))
        protectedHeaders.set_header(Label.new_text("address"), CBORValue.new_bytes(Buffer.from(address, "hex")))
        const protectedSerialized = ProtectedHeaderMap.new(protectedHeaders)
        const unprotectedHeaders = HeaderMap.new()
        const headers = Headers.new(protectedSerialized, unprotectedHeaders)
        const builder = COSESign1Builder.new(headers, Buffer.from(cardano.hexEncode(payload), "hex"), false)
        const toSign = builder.make_data_to_sign().to_bytes()
        const signedSigStruc = this.stakePvtKey.sign(toSign).to_bytes()
        const coseSign1 = builder.build(signedSigStruc)
        const key = COSEKey.new(Label.from_key_type(KeyType.OKP))
        key.set_algorithm_id(Label.from_algorithm_id(AlgorithmId.EdDSA))
        key.set_header(
            Label.new_int(
                Int.new_negative(BigNum.from_str("1"))
            ),
            CBORValue.new_int(
                Int.new_i32(6) //CurveType.Ed25519
            )
        ) // crv (-1) set to Ed25519 (6)
        key.set_header(
            Label.new_int(
                Int.new_negative(BigNum.from_str("2"))
            ),
            CBORValue.new_bytes(this.stakePvtKey.to_public().as_bytes())
        ) // x (-2) set to public key
        return {
            signature: Buffer.from(coseSign1.to_bytes()).toString("hex"),
            key: Buffer.from(key.to_bytes()).toString("hex"),
        }
    }

    public verifySignature(signature: string, key: string, payload: string): boolean {
        const address = this.stakeAddress.to_address().to_hex()
        return Wallet.verifySignature(signature, key, payload, address)
    }

    static verifySignature(signature: string, key: string, payload: string, address: string): boolean {
        const decodedSig = COSESign1.from_bytes(Buffer.from(signature, "hex"))
        const headermap = decodedSig.headers().protected().deserialized_headers();
        const nonceInSig = Buffer.from(decodedSig.payload()!).toString()
        const addressInSig = Address.from_bytes(headermap.header(Label.new_text('address'))!.as_bytes()!).to_bech32()
        const publicKey = PublicKey.from_bytes(Object.fromEntries(cbor.decode(key))['-2'])
        const signtr = Ed25519Signature.from_bytes(decodedSig.signature());
        const publicKeyIndeedSigned = publicKey.verify(decodedSig.signed_data().to_bytes(), signtr)
        return nonceInSig === payload && addressInSig === address && publicKeyIndeedSigned
    }

    public hashNativeScript(): NativeScript {
        const policyKeyHash = this.baseAddress.payment_cred().to_keyhash()!
        const nativeScript = NativeScript.new_script_pubkey(ScriptPubkey.new(policyKeyHash))
        return nativeScript
    }

}
