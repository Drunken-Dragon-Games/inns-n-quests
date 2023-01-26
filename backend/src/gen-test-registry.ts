import Registry from "./service-secure-signing/registry/registry"
import { cardano, Wallet } from "./tools-cardano"

function findArgFlagOrReturnDefault(flag: string, defaultValue: string): string {
    const index = process.argv.findIndex((arg, index) => arg == flag && index + 1 < process.argv.length) 
    return index == -1 ? defaultValue : process.argv[index + 1]
}

(async () => {

    const network = findArgFlagOrReturnDefault("--network", "testnet") == "testnet" ? "testnet" : "mainnet"
    const salt = findArgFlagOrReturnDefault("--salt", "{{ENCRYPTION_SALT}}")
    const password = findArgFlagOrReturnDefault("--password", "password")
    const registry = new Registry(network, { salt, password })

    const pixelTilesWallet = Wallet.generate(network, "")
    const pixelTilesPolicy = pixelTilesWallet.hashNativeScript()
    registry.addToCache(pixelTilesWallet, pixelTilesPolicy)
    
    const gmasWallet = Wallet.generate(network, "")
    const gmasPolicy = gmasWallet.hashNativeScript()
    registry.addToCache(gmasWallet, gmasPolicy)
    
    const thioldenWallet = Wallet.generate(network, "")
    const thioldenPolicy = thioldenWallet.hashNativeScript()
    registry.addToCache(thioldenWallet, thioldenPolicy)
    
    const dragonSilverWallet = Wallet.generate(network, "")
    const dragonSilverPolicy = dragonSilverWallet.hashNativeScript()
    registry.addToCache(dragonSilverWallet, dragonSilverPolicy)
    
    const emojisWallet = Wallet.generate(network, "")
    const emojisPolicy = emojisWallet.hashNativeScript()
    registry.addToCache(emojisWallet, emojisPolicy)
    
    const slimesWallet = Wallet.generate(network, "")
    const slimesPolicy = slimesWallet.hashNativeScript()
    registry.addToCache(slimesWallet, slimesPolicy)
    
    const furnitureWallet = Wallet.generate(network, "")
    const furniturePolicy = furnitureWallet.hashNativeScript()
    registry.addToCache(furnitureWallet, furniturePolicy)
    
    const exported = await registry.exportCache()
    const result = {
        network,
        password,
        salt,
        policies: {
            pixelTiles: cardano.policyId(pixelTilesPolicy),
            gmas: cardano.policyId(gmasPolicy),
            thiolden: cardano.policyId(thioldenPolicy),
            dragonSilver: cardano.policyId(dragonSilverPolicy),
            emojis: cardano.policyId(emojisPolicy),
            slimes: cardano.policyId(slimesPolicy),
            furniture: cardano.policyId(furniturePolicy),
        },
        registry: exported
    }

    console.log("JSON_DATA#BEGIN|"+JSON.stringify(result)+"|JSON_DATA#END")
})()