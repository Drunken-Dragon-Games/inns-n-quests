export interface TextEnvelope {
    type: string;
    description: string;
    cborHex: string;
}
export type CreateContractResponse = {
    contractId: string //this will likely need to be uptade to be a new type
    tx: TextEnvelope
}