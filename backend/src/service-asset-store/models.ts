import { SResult } from "../tools-utils"

export type AssetState = "idle" | "reserved" | "sold"
export type Token = { currency_symbol: string, token_name: string }
export type CompensatingAction =
    {command: "release assets", assets: Token[]} |
    {command: "retrive assets", assets: Token[], contractId: string}

//CHECKME: this type really should not live here hahaha
export type SuportedWallet = "Nami" | "Eternl"

export type TextEnvelope = {type: string, description: string, cborHex: string }

export type OrderState = 'created' | 'transaction_submited' | 'order_completed' | 'order_timed_out' | 'order_submition_failed' 

export const ADA: Token = {
    "currency_symbol": "",
    "token_name": ""
  }

export type OrderResponse = SResult<{orderId: string, tx: string}>

