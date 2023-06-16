import { Method } from "axios"

export type Endpoint = {path: string, method: Method}

export type Endpoints = Record<string, Endpoint>

export type CardanoTransactionInfo = {
  rawTransaction: string
  validFromSlot: string
  validToSlot: string
  amountTransferred: string
}

export type AssosiationTxResponse
  = {status: "ok", value: CardanoTransactionInfo}
  | {status: "invalid", reason: string}

export type HealthStatus 
  = {status: "ok", value: ""}
  | {status: "invalid", reason: string}