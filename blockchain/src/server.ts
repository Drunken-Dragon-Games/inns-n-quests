// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"
import cors from "npm:cors@2.8.5"
import { stringOrError } from "./utils.ts";
import { Network } from "./utypes.ts";
import { Lucid } from "https://deno.land/x/lucid@0.10.6/mod.ts";
import { Blockfrost } from "https://deno.land/x/lucid@0.10.6/mod.ts";
import { BlockchainServiceDsl } from "./service-blockchain/service.ts";
import { blockchainRoutes } from "./service-blockchain/routes-blockchain.ts";
import { servicePrefix } from "./service-blockchain/service-spec.ts";
import cookieParser from "npm:cookie-parser@1.4.6"
import { TransactionDSL } from "./service-blockchain/lucid-dsl/dsl.ts";
import { SecureSigningServiceDsl } from "./service-secure-signing/service.ts";
import {AES256} from "./service-secure-signing/registry/aes256.ts"
import {encryptionKey} from "./config.ts"

const projectId = await stringOrError("BLOCKFROST_API_KEY")
const network: Network = await stringOrError("CARDANO_NETWORK")
const blockfrostAPILink = network == "Mainnet" ? "https://cardano-mainnet.blockfrost.io/api/v0" : "https://cardano-preprod.blockfrost.io/api/v0"
const lucidFactory = async () => await Lucid.new(new Blockfrost(blockfrostAPILink, projectId), network)

const aes256 = await AES256.load(encryptionKey)

const secureSigningService = await SecureSigningServiceDsl.loadFromEnv(aes256, lucidFactory)
const transactionDSL: TransactionDSL = new TransactionDSL(lucidFactory, secureSigningService)

const blockchainService = new BlockchainServiceDsl(transactionDSL)

const app = express()

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`)
  next()
})
app.disable('x-powered-by')
app.use(express.json())
app.use(cookieParser())
//app.use(cors(corsOptions))
app.use(`/deno/${servicePrefix}`, blockchainRoutes(blockchainService))



app.listen(8000)