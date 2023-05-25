
export type MinimalUTxO = {
    txHash: string
    outputIndex: number
    assets: Assets
    address: string
}

export declare type Unit = string

export declare type Assets = Record<Unit | "lovelace", string>
