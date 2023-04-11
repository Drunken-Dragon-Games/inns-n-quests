
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

export type ClaimState
    = { ctype: "claim-state-idle"}
    | { ctype: "claim-state-loading"}
    | { ctype: "claim-state-submited"}
    | { ctype: "claim-state-succeded"}
    | { ctype: "claim-state-error", error: string}
