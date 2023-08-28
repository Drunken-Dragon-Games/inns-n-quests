//import { Lucid } from "../deps.ts"
import { BlockFrostAPI } from "../../../../../AppData/Local/deno/npm/registry.npmjs.org/@blockfrost/blockfrost-js/5.3.1/lib/BlockFrostAPI.js";
import { Lucid } from "../deps.ts";
import { exists } from "../utils.ts";
import { LucidFactory } from "../utypes.ts";
import { BlockFrost } from "../deps.ts";

export class AotWallet {

    readonly walletName: string = "aot-wallet"

    constructor(
        private lucidFactory: LucidFactory, 
        private blockfrost: BlockFrost.BlockFrostAPI,
        private network: "mainnet" | "preprod" = "preprod"
    ) {}

    fullWalletName(): string {
        return `${this.walletName}.${this.network}`
    }

    async generateWallet(): Promise<Lucid.Lucid> {
        const privateKeyExists = await exists(`${this.fullWalletName()}.sk`)
        const addressExists = await exists(`${this.fullWalletName()}.addr`)

        if (privateKeyExists && addressExists) {
            return await this.loadWallet()
        } else {
            const lucid = await this.lucidFactory()
            const privateKey = lucid.utils.generatePrivateKey();
            await Deno.writeTextFile(`${this.fullWalletName()}.sk`, privateKey);
            const address = await lucid
                .selectWalletFromPrivateKey(privateKey)
                .wallet.address();
            await Deno.writeTextFile(`${this.fullWalletName()}.addr`, address)
            console.log("CREATED wallet...")
            return lucid.selectWalletFromPrivateKey(privateKey)
        }
    }

    async loadWallet(): Promise<Lucid.Lucid> {
        const lucid = await this.lucidFactory()
        const privateKey = await Deno.readTextFile(`${this.fullWalletName()}.sk`)
        console.log("LOADED wallet...")
        return lucid.selectWalletFromPrivateKey(privateKey)
    }

    async printUtxos(wallet: Lucid.Lucid): Promise<void> {
        const utxos = await wallet.wallet.getUtxos()
        if (utxos.length == 0) return console.log("No UTXOs found")
        utxos.forEach((utxo, i) => {
            console.log(`${i}:`)
            console.log(utxo)
        })
    }

    async getUtxoByIndex(wallet: Lucid.Lucid, index: number): Promise<Lucid.UTxO> {
        if (index < 0) throw Error("Index must be greater than 0.")
        const utxos = await wallet.wallet.getUtxos()
        if (index >= utxos.length) throw Error(`Index must be less than the number of UTXOs. (Max Index: ${utxos.length - 1})`)
        const utxo = utxos[index]
        return utxo
    }

    async getFullUtxoTx(wallet: Lucid.Lucid, index: number) {
        const utxo = await this.getUtxoByIndex(wallet, index)
        return await this.blockfrost.txsUtxos(utxo.txHash)
    }

    async printFullUtxoTx(wallet: Lucid.Lucid, index: number): Promise<void> {
        const utxo = await this.getFullUtxoTx(wallet, index)
        console.log(utxo)
    }

    async returnAssetsOfUtxoByIndex(wallet: Lucid.Lucid, index: number): Promise<string> {
        const utxo = await this.getUtxoByIndex(wallet, index)
        const fullTxUtxo = await this.getFullUtxoTx(wallet, index)
        const tx = await wallet.newTx()
            .payToAddress(fullTxUtxo.inputs[0].address, utxo.assets)
            .complete()
        const txId = await (await tx.sign().complete()).submit()
        console.log(`[txid: ${txId}]... Returned all assets of original tx: ${fullTxUtxo.hash}`)
        return txId 
    }
}