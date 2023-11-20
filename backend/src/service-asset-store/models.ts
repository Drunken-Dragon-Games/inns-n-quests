export type AssetState = "idle" | "reserved" | "sold" | "in Contract"
export type Token = { currency_symbol: string, token_name: string }
export type ExitComand =
    {comand: "release assets", assets: Token[]}