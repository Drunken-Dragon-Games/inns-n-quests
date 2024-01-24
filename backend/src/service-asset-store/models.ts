import { SResult } from "../tools-utils"

export type AssetState = "idle" | "reserved" | "sold"
export type Token = { currency_symbol: string, token_name: string }
export type CompensatingAction =
    {command: "release assets", assets: Token[]} |
    {command: "retrive assets", assets: Token[], contractId: string}

//CHECKME: this type really should not live here hahaha
export type SuportedWallet = "Nami" | "Eternl"

export type TextEnvelope = {type: string, description: string, cborHex: string }

export type RefoundState = 
'completed' |
'failed' |
'submited'|
'timedout' |
'initialized' |
'none'

export type OrderState = 
  'empty' | 
  'intialized' | 
  'ada_deposit_submited' | 
  'ada_deposit_failed' | 
  'ada_deposit_timedOut' | 
  'assets_deposit_submited' | 
  'assets_deposit_failed' | 
  'assets_deposit_timedOut'| 
  'order_completed' 

export const ADA: Token = {
    "currency_symbol": "",
    "token_name": ""
  }

export type OrderResponse = SResult<{orderId: string, tx: string}>

export type SubmitResponse = SResult<{txId: string}>

export type OrderStatusResponse = SResult<{status: OrderState}>


