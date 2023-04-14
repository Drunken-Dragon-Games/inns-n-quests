import path from "path"
import fs from "fs/promises"

import { NFTMintOptions, cardano, TokenMintOptions, CardanoNetwork } from "./utils"
import { Wallet } from "./wallet"
import { NativeScript, Transaction } from "@emurgo/cardano-serialization-lib-nodejs"
import { BlockFrostAPI } from "@blockfrost/blockfrost-js"

const network: CardanoNetwork = "Preprod"

const blockfrost: BlockFrostAPI = new BlockFrostAPI({ projectId: "preprod3AJiD07toi4rcvmhnVSZ92Auip8fh2RW" })

const stubPath = (filename: string): string =>
    path.join(__dirname, "..", "..", "stubs", "test-keys", filename)

const nftOptions = (script: NativeScript): NFTMintOptions => {
    return {
        assetName: "PixelTile50",
        metadata: {
            alt: "https://www.drunkendragon.games/s1/PixelTile50.png",
            image: "ipfs://QmfR8ma2SpLzz1ddaBTG8rYETJA1cnekz7Rcazs3wTW98A",
            name: "PixelTile #50 Empress Bunny",
            rarity: "Unique",
            type: "Adventurer"
        },
        script,
    }
}

const tokenOptions = (script: NativeScript, amount: string): TokenMintOptions => {
    return {
        assetName: "DragonSilver",
        metadata: {
            key: "674",
            data: { msg: [ "test-message", "This is a test transaction" ] }
        },
        fee: {
            address: "addr_test1qz9kpgdly4yfy0pyv3zj9exszmqh8ytml3jrqsjqmu74y85e4ruvq60uyzc0e0u988ypdn96y9jfstgj0xumdt60sekquu988q",
            quantity: "1000000"
        },
        amount,
        script,
    }
}

const nftMintExample = async (): Promise<string> => {
    const mintingWallet = await Wallet.loadFromFiles(network, 
        stubPath("payment.skey"), 
        stubPath("stake.skey"))
    const signingWallet = Wallet
        .recover(network, await fs.readFile(stubPath("wallet1"), "utf8"), "password")
    const stakeAddress = signingWallet.stakeAddress().to_address().to_bech32()
    const script = mintingWallet.hashNativeScript()
    const unsignedTx = await cardano.createNFTMintTransaction(stakeAddress, nftOptions(script), blockfrost)
    const witness1 = signingWallet.signTx(Transaction.from_hex(unsignedTx.to_hex()))
    const exported = mintingWallet.exportWallet()
    const recover = await Wallet.importWallet(network, exported)
    const witness2 = recover.signWithPolicy(cardano.addWitnessesToTransaction(witness1, unsignedTx), script)
    const txId = await blockfrost.txSubmit(cardano.addWitnessesToTransaction(witness2, unsignedTx).to_hex())
    return txId
}

const tokenMintExample = async (): Promise<string> => {
    const mintingWallet = await Wallet.loadFromFiles(network, 
        stubPath("payment.skey"), 
        stubPath("stake.skey"))
    const signingWallet = Wallet
        .recover(network, await fs.readFile(stubPath("wallet1"), "utf8"), "password")
    const stakeAddress = signingWallet.stakeAddress().to_address().to_bech32()
    const script = mintingWallet.hashNativeScript()
    const unsignedTx = await cardano.createTokenMintTransaction(stakeAddress, tokenOptions(script, "100"), blockfrost)
    const witness1 = signingWallet.signTx(Transaction.from_hex(unsignedTx.to_hex()))
    const witness2 = mintingWallet.signWithPolicy(cardano.addWitnessesToTransaction(witness1, unsignedTx), script)
    const txId = await blockfrost.txSubmit(cardano.addWitnessesToTransaction(witness2, unsignedTx).to_hex())
    return txId
}

test("Mint asset", async () => {
    //console.log(await nftMintExample())
    //console.log(await tokenMintExample())
})

test("Wallet export/recover: ok 1", async () => {
    const wallet = await Wallet.loadFromFiles(network, 
        stubPath("payment.skey"), 
        stubPath("stake.skey"))
    const exported = wallet.exportWallet()
    const recover = await Wallet.importWallet(network, exported)
    expect(wallet.paymentPubKey.hash().to_hex()).toBe(recover.paymentPubKey.hash().to_hex())
    expect(wallet.stakePubKey.hash().to_hex()).toBe(recover.stakePubKey.hash().to_hex())
})

test("Wallet export/recover: ok 2", async () => {
    const wallet = await Wallet.generate(network, "password")
    const exported = wallet.exportWallet()
    const recover = await Wallet.importWallet(network, exported)
    expect(wallet.paymentPubKey.hash().to_hex()).toBe(recover.paymentPubKey.hash().to_hex())
    expect(wallet.stakePubKey.hash().to_hex()).toBe(recover.stakePubKey.hash().to_hex())
})