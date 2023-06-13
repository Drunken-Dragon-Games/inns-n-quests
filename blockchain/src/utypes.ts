export type Resolution<A, B = string> = {status: "succeded", value: A} | {status: "failed", reason: B, code?: number}

export const succed = <A>(value: A): Resolution<A> => {return {status: "succeded", value }}
export const fail = < A = unknown, B = string>(reason: B, code?: number): Resolution<A, B> => {return {status: "failed", reason, code }}