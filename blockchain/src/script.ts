import { BlockFrost } from "./deps.ts"
import { Lucid } from "./deps.ts";
import { AotWallet } from "./service-aot/aot-wallet.ts";
import { stringOrError } from "./utils.ts";
import { Network } from "./utypes.ts";

const projectId = await stringOrError("BLOCKFROST_API_KEY")
const network: Network = await stringOrError("CARDANO_NETWORK")
const blockfrostAPILink = network == "Mainnet" ? "https://cardano-mainnet.blockfrost.io/api/v0" : "https://cardano-preprod.blockfrost.io/api/v0"
const blockfrost = new BlockFrost.BlockFrostAPI({ projectId })
const lucidFactory = async () => await Lucid.Lucid.new(new Lucid.Blockfrost(blockfrostAPILink, projectId), network)

const aotWallet = new AotWallet(lucidFactory, blockfrost, network.toLowerCase() as "mainnet" | "preprod")
const wallet = await aotWallet.generateWallet()
await aotWallet.printUtxos(wallet)