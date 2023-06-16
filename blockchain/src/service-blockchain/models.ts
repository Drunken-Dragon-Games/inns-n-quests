import { Prettify, Resolution } from "../utypes.ts"

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

export type Endpoint = {path: string, method: Method}

export type Endpoints = Record<string, Endpoint>

export type CardanoTransactionInfo = {
  rawTransaction: string
  validFromSlot: string
  validToSlot: string
  amountTransferred: string
}

export type HealthStatus = Resolution<"">

export type AssosiationTxResponse = Resolution<CardanoTransactionInfo>
