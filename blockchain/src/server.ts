import { Lucid, cookieParser, express, compression } from "./deps.ts"
import { TransactionDSL } from "./service-blockchain/lucid-dsl/dsl.ts"
import { blockchainRoutes } from "./service-blockchain/routes-blockchain.ts"
import { servicePrefix } from "./service-blockchain/service-spec.ts"
import { BlockchainServiceDsl } from "./service-blockchain/service.ts"
import { AES256 } from "./service-secure-signing/registry/aes256.ts"
import { SecureSigningServiceDsl } from "./service-secure-signing/service.ts"
import { stringOrError } from "./utils.ts"
import { Network } from "./utypes.ts"

const port = 8000

export const app = async () => {
  const projectId = await stringOrError("BLOCKFROST_API_KEY")
  const network: Network = await stringOrError("CARDANO_NETWORK")
  const blockfrostAPILink = network == "Mainnet" ? "https://cardano-mainnet.blockfrost.io/api/v0" : "https://cardano-preprod.blockfrost.io/api/v0"
  const lucidFactory = async () => await Lucid.Lucid.new(new Lucid.Blockfrost(blockfrostAPILink, projectId), network)
  const aes256 = await AES256.load("9d8a1876f66da8b25753ef4b82cab693")
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
  app.use(compression())
  app.use(`/deno/${servicePrefix}`, blockchainRoutes(blockchainService))

  app.listen(port, "0.0.0.0", () => {
    console.log(`Blockchain TX Service running on port ${port}...`)
  })
}

await app()