//type repeted in governance service
export interface Ballot {
    question: string
    options: string[]
  }

export type ConfirmMessagge = {confirm?: string, cancel: string, timeout: string}
