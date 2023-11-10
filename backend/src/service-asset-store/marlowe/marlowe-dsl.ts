import { SResult } from "../../tools-utils";
import { CreateContractResponse } from "./models";

// TODO: Implement this once the required updates by the Marlowe team are available.
export class MarloweDSl {
    //TODO: this will also take as a parameter an AOTInvenotryDSL frpom wich it gets available AOts
    // also some configuration like the minUTxODeposit
    constructor(private readonly webServerURl : string){}

    async genInitAOTContractTx(buyerAddress: string, sellerAddress: string, quantity: number): Promise<SResult<{constractInfo: CreateContractResponse}>>{
        return {} as SResult<{constractInfo: CreateContractResponse}>
    }

    async signCreateContractTx(unsignedTxCBORHex: string): Promise<string>{
        return ""
    }

    async submitContractTx(contractId: string, rawSignedTx: string): Promise<void>{}
}