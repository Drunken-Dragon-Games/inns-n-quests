import { Method } from "axios"

export type Endpoint = {path: string, method: Method}

export type Endpoints = Record<string, Endpoint>

export type CardanoTransactionInfo = {
  rawTransaction: string
  txHash: string
}

export type BuildTxResponse
  = {status: "ok", value: CardanoTransactionInfo}
  | {status: "invalid", reason: string}

export type TransactionHashReponse
  = {status: "ok", value: string}
  | {status: "invalid", reason: string}

export type SubmitTransactionReponse
  = {status: "ok", value: string}
  | {status: "invalid", reason: string}

export type HealthStatus 
  = {status: "ok", value: ""}
  | {status: "invalid", reason: string}

export type LucidNativeScript = {
    type: "sig" | "all" | "any" | "before" | "atLeast" | "after"
    keyHash?: string
    required?: number
    slot?: number
    scripts?: LucidNativeScript[]
  }
