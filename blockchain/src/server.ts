// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"
import { walletRoutes } from "./wallet/routes-wallet.ts"
import {CardanoDsl} from "./wallet/lucid-dsl.ts"

const cardanoDSL = await CardanoDsl.loadFromEnv()

const app = express()
app.use(express.json())

app.use("/blockchain", walletRoutes(cardanoDSL))

app.listen(8000)