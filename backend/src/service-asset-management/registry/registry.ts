import { RegistryPolicy } from "../models"
import { mainnetRegistry } from "./registry-mainnet"
import { testnetRegistry } from "./registry-testnet"

export default class Registry {

    constructor(private network: "mainnet" | "testnet"){}

    list(): RegistryPolicy[] {
        if (this.network == "mainnet") return mainnetRegistry 
        else return testnetRegistry
    }
}
