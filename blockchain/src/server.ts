// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2"
import { walletRoutes } from "./wallet/routes-wallet.ts"


const app = express()
app.use(express.json())

app.use("/blockchain", walletRoutes())

app.listen(8000)