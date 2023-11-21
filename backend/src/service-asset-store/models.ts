export type AssetState = "idle" | "reserved" | "sold" | "in Contract"
export type Token = { currency_symbol: string, token_name: string }
export type CompensatingAction =
    {command: "release assets", assets: Token[]} |
    {command: "retrive assets", assets: Token[], contractId: string}

export type TextEnvelope = {type: string, description: string, cborHex: string }

export const ADA: Token = {
    "currency_symbol": "",
    "token_name": ""
  }