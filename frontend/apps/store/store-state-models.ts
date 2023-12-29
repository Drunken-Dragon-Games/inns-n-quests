export type AotOrderState
= {ctype: "idle"}
| {ctype: "connecting to wallet"}
| {ctype: "Getting transaction"}
| {ctype: "Waiting for signature"}
| {ctype: "submiting transaction"}
| {ctype: "waiting for confirmation"}
| {ctype: "Transaction confirmed!"}
| {ctype: "error", details: string}