import { Method } from "axios"

export type Endpoint = {path: string, method: Method}

export type Endpoints = Record<string, Endpoint>

export type CardanoTransactionInfo = {
  rawTransaction: string
  txHash: string
}

export type AssosiationTxResponse
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
