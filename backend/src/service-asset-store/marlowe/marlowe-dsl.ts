import { SResult } from "../../tools-utils";
import { Token } from "../models";
import { CreateContractResponse } from "./models";

// TODO: Implement this once the required updates by the Marlowe team are available.
export class MarloweDSl {
    //TODO: this will some configuration like the minUTxODeposit
    constructor(private readonly webServerURl : string){}

    async genInitContractTx(buyerAddress: string, sellerAddress: string, assets: Token[]): Promise<SResult<{constractInfo: CreateContractResponse}>>{
        return {} as SResult<{constractInfo: CreateContractResponse}>
    }

    async signCreateContractTx(unsignedTxCBORHex: string): Promise<string>{
        return ""
    }

    async submitContractTx(contractId: string, rawSignedTx: string): Promise<void>{}
}