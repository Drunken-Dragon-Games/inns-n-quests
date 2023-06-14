// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"
import { walletRoutes } from "./wallet/routes-wallet.ts"
import {CardanoDsl} from "./wallet/lucid-dsl.ts"
import cors from "npm:cors@2.8.5"

const cardanoDSL = await CardanoDsl.loadFromEnv()

const app = express()

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`)
  next()
})
app.use(express.json())
app.use(cors({origin: "http://localhost:3000",credentials: true}));
app.use("/blockchain", walletRoutes(cardanoDSL))



app.listen(8000)