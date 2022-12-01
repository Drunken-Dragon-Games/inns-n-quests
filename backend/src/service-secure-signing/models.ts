
export type PolicyResult 
    = { status: "ok", policy: object }
    | { status: "unknown-policy" } 

export type SignTxResult 
    = { status: "ok" , witness: string }
    | { status: "bad-tx" }
    | { status: "forbidden" }

export type SignDataResult
    = { status: "ok", payload: { signature: string, key: string } }
    | { status: "bad-tx" }
    | { status: "forbidden" }
