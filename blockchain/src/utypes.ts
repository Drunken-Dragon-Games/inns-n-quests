export type Resolution<A, B = string> = {status: "ok", value: A} | {status: "invalid", reason: B, code?: number}

export const succed = <A>(value: A): Resolution<A> => {return {status: "ok", value }}
export const fail = < A = unknown, B = string>(reason: B, code?: number): Resolution<A, B> => {return {status: "invalid", reason, code }}

export type Prettify<T> = {
    [K in keyof T]: T[K]
}

export type Network = "Mainnet" | "Preprod"