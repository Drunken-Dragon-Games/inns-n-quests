
export type UserInfo = {
    userId: string
    sessionId: string
    nickname: string
    stakeAddresses: string[]
    profileUri: string
    email: string
    dragonSilver: number
    dragonSilverToClaim: number
}

export const SupportedWallets = [ "Nami", "Eternl" ] as const

export type SupportedWallet = typeof SupportedWallets[number]

export type WalletApi 
    = { ctype: "api", wallet: SupportedWallet, api: any }
    | { ctype: "error", error: string }
    | { ctype: "loading" }
