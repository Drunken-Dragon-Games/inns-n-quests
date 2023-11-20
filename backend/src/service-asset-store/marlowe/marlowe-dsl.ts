import { SResult } from "../../tools-utils";
import { Token } from "../models";
import { CreateContractResponse } from "./models";

// TODO: Implement this once the required updates by the Marlowe team are available.
export class MarloweDSl {
    //TODO: this will some configuration like the minUTxODeposit
    constructor(private readonly webServerURl : string){}

    async genInitContractTx(buyerAddress: string, sellerAddress: string, assets: Token[]): Promise<SResult<{constractInfo: CreateContractResponse}>>{
        //Generamos el marlowe contract json
        //const client = clientModule.mkRestClient(MARLOWE_RT_WEBSERVER_URL)
        //llamamos client.createContract
        return {} as SResult<{constractInfo: CreateContractResponse}>
    }

    async signCreateContractTx(unsignedTxCBORHex: string): Promise<SResult<{signedTx: string}>>{
        /*
            import * as wn from "@marlowe.io/wallet/dist/esm/nodejs"
            const context = new wn.Context(BLProjectId, "https://cardano-preprod.blockfrost.io/api/v0", "Preprod")
            const pk = fs.readFileSync("./key.sk", 'utf8')
            const wallet = await wn.SingleAddressWallet.Initialise(context, pk)
            const signedTx = await wallet.signTx(unsignedTxCBORHex)
        */
        return {ctype: "success", signedTx: ""}
    }

    async submitContractTx(contractId: string, rawSignedTx: string): Promise<void>{
        /*
            const client = clientModule.mkRestClient(MARLOWE_RT_WEBSERVER_URL)
            const requestObject = {
                type: "ShelleyTxWitness BabbageEra",
                description: "",
                cborHex: rawSignedTx
            }
            await client.submitContract(CONTRACT_ID, requestObject)
        */
    }

    async awaitContract(contractId: string){

    }
}