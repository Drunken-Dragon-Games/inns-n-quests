import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import CardanoWasm, { NativeScript, TimelockExpiry } from "@emurgo/cardano-serialization-lib-nodejs"
import path from "path"
import fs from "fs/promises"
import { CardanoNetwork, Wallet, NFTMintOptions, cardano } from "../../tools-cardano"
import Registry from "./registry"

const network: CardanoNetwork = "Preprod"

const temporalScript = (signer: Wallet): NativeScript => {
    const sig = signer.hashNativeScript()
    const lock = NativeScript.new_timelock_expiry(TimelockExpiry.new_timelockexpiry(CardanoWasm.BigNum.one()))
    const scripts = CardanoWasm.NativeScripts.new()
    scripts.add(sig)
    scripts.add(lock)
    return NativeScript.new_script_all(CardanoWasm.ScriptAll.new(scripts))
}

test("Registry import/export: ok", async () => {
    const wallet = Wallet.generate(network, "password")
    const registryCredentials = { salt: "salt", password: "password" }
    const registry1 = new Registry(network, registryCredentials)
    const policy = temporalScript(wallet)
    registry1.addToCache(wallet, policy)
    const exported = await registry1.exportCache()
    const registry2 = new Registry(network, registryCredentials)
    await registry2.importCache(exported)
    const policyID = cardano.policyId(policy)
    expect(cardano.policyId(registry1.getCache()[policyID].policy)).toBe(policyID)
    expect(cardano.policyId(registry2.getCache()[policyID].policy)).toBe(policyID)
    const hash1 = registry1.getCache()[policyID].signer.paymentPubKey.hash().to_hex()
    const hash2 = registry2.getCache()[policyID].signer.paymentPubKey.hash().to_hex()
    expect(hash1).toBe(hash2)
})

test("Registry import/export: bad 1", async () => {
    const wallet = Wallet.generate(network, "password")
    const registry1 = new Registry(network, { salt: "salt", password: "password" })
    const policy = temporalScript(wallet)
    registry1.addToCache(wallet, policy)
    const exported = await registry1.exportCache()
    const registry2 = new Registry(network, { salt: "salt2", password: "password" })
    let message: string = ""
    try { await registry2.importCache(exported) } 
    catch (e: any) { message = e.message }
    expect(message).toMatch(new RegExp("(.+)bad decrypt"))
})

test("Registry import/export: bad 2", async () => {
    const wallet = Wallet.generate(network, "password")
    const registry1 = new Registry(network, { salt: "salt", password: "password" })
    const policy = temporalScript(wallet)
    registry1.addToCache(wallet, policy)
    const exported = await registry1.exportCache()
    const registry2 = new Registry(network, { salt: "salt", password: "password2" })
    let message: string = ""
    try { await registry2.importCache(exported) } 
    catch (e: any) { message = e.message }
    expect(message).toMatch(new RegExp("(.+)bad decrypt"))
})

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

const blockfrost: BlockFrostAPI = new BlockFrostAPI({ projectId: "preprod3AJiD07toi4rcvmhnVSZ92Auip8fh2RW" })

const stubPath = (filename: string): string =>
    path.join(__dirname, "..", "..", "..", "stubs", "test-keys", filename)

const mintExample = async (registry: Registry, script: NativeScript): Promise<string> => {
    const signingWallet = Wallet
        .recover(network, await fs.readFile(stubPath("wallet1"), "utf8"), "password")
    const stakeAddress = signingWallet.stakeAddress().to_address().to_bech32()
    const unsignedTx = await cardano.createNFTMintTransaction(stakeAddress, nftOptions(script), blockfrost)
    const witness1 = signingWallet.signTx(CardanoWasm.Transaction.from_hex(unsignedTx.to_hex()))
    const witness2 = registry.signWithPolicy(cardano.policyId(script), cardano.addWitnessesToTransaction(witness1, unsignedTx))!
    return cardano.addWitnessesToTransaction(witness2, unsignedTx).to_hex()
}

/*
test("Mint example", async () => {
    const mintingWallet = await Wallet.loadFromFiles(network, 
        stubPath("payment.skey"), 
        stubPath("stake.skey"))
    const script = mintingWallet.hashNativeScript()
    const registry = new Registry(network, { salt: "{{ENCRYPTION_SALT}}", password: "password" })
    registry.addToCache(mintingWallet, script)
    const tx = await mintExample(registry, script)
    //console.log(await blockfrost.txSubmit(tx))
})
*/

test("Print policy scripts", async () => {
    const mintingWallet = await Wallet.loadFromFiles(network, 
        stubPath("payment.skey"), 
        stubPath("stake.skey"))
    const script = mintingWallet.hashNativeScript()
    const registry = new Registry(network, { salt: "{{ENCRYPTION_SALT}}", password: "password" })
    registry.addToCache(mintingWallet, script)
    const response = registry.policy(cardano.policyId(script))
    expect(response).toStrictEqual({ "ScriptPubkey": {"addr_keyhash": mintingWallet.paymentPubKey.hash().to_hex()} })
})

/*
test("Print policy scripts", async () => {
    dotenv.config()
    const salt = process.env["REGISTRY_SALT"]!
    const password = process.env["REGISTRY_PASSWORD"]!
    const registryData = process.env["REGISTRY_DATA"]!
    const registry = new Registry(network, { salt, password })
    await registry.importCache(registryData)
    console.log(await registry.policy("cfd283330fdb8b57d67029a06a96e02bd84ed48c14c951f8e70a5736"))
})
*/

/*
test("UTILS, DO NOT EXEC", async () => {
    dotenv.config()
    const salt = process.env["REGISTRY_SALT"]!
    const password = process.env["REGISTRY_PASSWORD"]!
    const registry = new Registry(network, { salt, password })

    const dsWallet = await Wallet.loadFromFiles("mainnet", __dirname+"/../secrets/dragon-silver.payment.skey", __dirname+"/../secrets/dragon-silver.stake.skey")
    const dsPolicy = dsWallet.hashNativeScript()
    registry.addToCache(dsWallet, dsPolicy)
    console.log("Dragon Silver: " + cardano.policyId(dsPolicy))

    const pixelTilesWallet = Wallet.generate(network, "")
    const pixelTilesPolicy = pixelTilesWallet.hashNativeScript()
    registry.addToCache(pixelTilesWallet, pixelTilesPolicy)
    console.log("PixelTiles: " + cardano.policyId(pixelTilesPolicy))
    
    const gmasWallet = Wallet.generate(network, "")
    const gmasPolicy = gmasWallet.hashNativeScript()
    registry.addToCache(gmasWallet, gmasPolicy)
    console.log("GMAs: " + cardano.policyId(gmasPolicy))
    
    const thioldenWallet = Wallet.generate(network, "")
    const thioldenPolicy = thioldenWallet.hashNativeScript()
    registry.addToCache(thioldenWallet, thioldenPolicy)
    console.log("Thiolden Advs: " + cardano.policyId(thioldenPolicy))
    
    const dragonSilverWallet = Wallet.generate(network, "")
    const dragonSilverPolicy = dragonSilverWallet.hashNativeScript()
    registry.addToCache(dragonSilverWallet, dragonSilverPolicy)
    console.log("DragonSilver: " + cardano.policyId(dragonSilverPolicy))
    
    const emojisWallet = Wallet.generate(network, "")
    const emojisPolicy = emojisWallet.hashNativeScript()
    registry.addToCache(emojisWallet, emojisPolicy)
    console.log("Emojis: " + cardano.policyId(emojisPolicy))
    
    const slimesWallet = Wallet.generate(network, "")
    const slimesPolicy = slimesWallet.hashNativeScript()
    registry.addToCache(slimesWallet, slimesPolicy)
    console.log("Slimes pfp: " + cardano.policyId(slimesPolicy))
    
    //const furnitureWallet = Wallet.generate(network, "")
    //const newFurnitureWallet = furnitureWallet.hashNativeScript()
    //registry.addToCache(furnitureWallet, newFurnitureWallet)
    //console.log("Furniture: " + cardano.policyId(newFurnitureWallet))
    
    //const ddeXjpgWallet = Wallet.generate(network, "")
    //const ddeXjpgPolicy = ddeXjpgWallet.hashNativeScript()
    //registry.addToCache(ddeXjpgWallet, ddeXjpgPolicy)
    //console.log("DDE x JPG: " + cardano.policyId(ddeXjpgPolicy))
    
    const exported = await registry.exportCache()
    console.log("REGISTRY CACHE: " + exported)
})
*/