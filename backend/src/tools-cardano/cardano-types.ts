
export type UTxO = {
    txHash: string
    outputIndex: number
    assets: Assets
    address: string
    datumHash?: string | null
    datum?: string | null
    scriptRef?: string | null
}

export declare type Unit = string

export declare type Assets = Record<Unit | "lovelace", bigint>

export declare type Script = {
    type: ScriptType
    script: string
}

export declare type ScriptType = "Native" | PlutusVersion

export declare type PlutusVersion = "PlutusV1" | "PlutusV2"
