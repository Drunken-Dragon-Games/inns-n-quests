export type AssetState = "idle" | "reserved" | "sold"
export type Token = { currency_symbol: string, token_name: string }
export type CompensatingAction =
    {command: "release assets", assets: Token[]} |
    {command: "retrive assets", assets: Token[], contractId: string}

//CHECKME: this type really should not live here hahaha
export type SuportedWallet = "Nami" | "Eternl"

export type TextEnvelope = {type: string, description: string, cborHex: string }

export type OrderState = 'created' | 'transaction_confirmed' | 'order_completed'

export const ADA: Token = {
    "currency_symbol": "",
    "token_name": ""
  }