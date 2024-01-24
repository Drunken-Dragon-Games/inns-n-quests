export type AotOrderState =
  | { ctype: "Idle" }
  | { ctype: "Connecting to Wallet" }
  | { ctype: "Getting Transaction" }
  | { ctype: "Waiting for Signature" }
  | { ctype: "Submitting Transaction" }
  | { ctype: "Waiting for Confirmation" }
  | { ctype: "Transaction Confirmed!" }
  | { ctype: "Error"; details: string };
