import { Lucid, UTxO as LucidUTxO, Utils } from "lucid-cardano"

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

type WalletAction = "claim" | "associate"

export type WalletActionState
    = { ctype: "wallet-action-state-idle", action: WalletAction}
    | { ctype: "wallet-action-state-loading", action: WalletAction, details: string }
    | { ctype: "wallet-action-state-submitted", action: WalletAction, details: string }
    | { ctype: "wallet-action-state-succeeded", action: WalletAction}
    | { ctype: "wallet-action-state-error", action: WalletAction, details: string }
    
//Omit<WalletActionState, 'action'> does not work like its supposed to so here we are
export type WalletActionPayload
    = { ctype: "wallet-action-state-idle" }
    | { ctype: "wallet-action-state-loading", details: string }
    | { ctype: "wallet-action-state-submitted", details: string }
    | { ctype: "wallet-action-state-succeeded" }
    | { ctype: "wallet-action-state-error", details: string };

export type ClaimerInfo = {
    utxos: UTxOMinimal[],
    receivingAddress: string,
}

export type UTxOMinimal = {
    txHash: string
    outputIndex: number
    assets: Assets
    address: string
}

export declare type Unit = string

export declare type Assets = Record<Unit | "lovelace", string>

export const renderWalletActionDetails = (walletActionState: WalletActionState) => {
        const { ctype, action } = walletActionState;
        const details = ctype === "wallet-action-state-loading" || ctype === "wallet-action-state-submitted" || ctype === "wallet-action-state-error" ? walletActionState.details : undefined;
    
        return `${action}-${ctype} ${details || ""}`;
    }

export type ExtractWalletResult
    = {status: "ok", walletApi: Lucid, stakeAddress: string, }
    | {status: "error", details: string}

export const minimalUtxoFromLucidUTxO = (utxo: LucidUTxO[]): UTxOMinimal[] => utxo.map(utxo => ({
    txHash: utxo.txHash,
    outputIndex: utxo.outputIndex,
    assets: Object.keys(utxo.assets).reduce((acc, key) => ({ ...acc, [key]: utxo.assets[key].toString() }), {}),
    address: utxo.address,
}))