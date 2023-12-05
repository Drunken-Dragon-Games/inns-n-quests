import { SResult, sfailure, ssuccess, success } from "../../tools-utils";
import { TextEnvelope, Token } from "../models";
import { CreateContractResponse } from "./models";

// TODO: Implement this once the required updates by the Marlowe team are available.
export class MarloweDSl {
    //TODO: this will some configuration like the minUTxODeposit
    constructor(private readonly webServerURl : string){}

    async genInitContractTx(buyerAddress: string, sellerAddress: string, assets: Token[]): Promise<SResult<{contractInfo: CreateContractResponse}>>{
        //Generamos el marlowe contract json
        //const client = clientModule.mkRestClient(MARLOWE_RT_WEBSERVER_URL)
        //llamamos client.createContract
        return {} as SResult<{contractInfo: CreateContractResponse}>
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

    async genDepositIntoContractTX(contractId: string, payeeeAddress: string, tokens: {asset:Token, quantity: string}[]): Promise<SResult<{textEnvelope: TextEnvelope, transactionId: string}>>{
        /* import * as wn from "npm:@marlowe.io/wallet/nodejs";
        import * as clientModule from "npm:@marlowe.io/runtime-rest-client";
        import * as w from "npm:@marlowe.io/wallet";
        import { MarloweVersion } from "npm:@marlowe.io/language-core-v1/version";
        import * as core from "npm:@marlowe.io/runtime-core";
        const pk = await Deno.readTextFile("./key.sk")
        const BLProjectId = await stringOrError("BLOCKFROST_API_KEY")
        const context = new wn.Context(BLProjectId, "https://cardano-preprod.blockfrost.io/api/v0", "Preprod")
        const wallet = await wn.SingleAddressWallet.Initialise(context, pk)
        const addressNCollater = await w.getAddressesAndCollaterals(wallet)
        const funClient = clientModule.mkFPTSRestClient(this.webServerURl)
        const version: MarloweVersion = "v1"
        const metadata: core.Metadata = {}
        const tags: core.Tags = {}
        const interactWithContractRequestObject = {
            version,
            inputs: [
                {
                  "input_from_party": {
                    "address": payeeeAddress
                  },
                  "into_account": {
                    "address": payeeeAddress
                  },
                  //TODO: make this work with several tokens
                  "of_token": {
                    "currency_symbol": "",
                    "token_name": ""
                  },
                  "that_deposits": 50_000_000
                }
              ],
            metadata,
            tags
        }
        const response = await funClient.contracts.contract.transactions.post(contractId, interactWithContractRequestObject, addressNCollater)()
        if (response._tag == "Left"){
            //this is an axios error
            // deno-lint-ignore no-explicit-any
            console.log((response.left as any).response.data)
            return sfailure("fialed")
        }
        else{
            const textEnvelope: TextEnvelope = response.right.tx
            return success({textEnvelope, transactionId:response.right.transactionId })
        } */
        return success({} as {textEnvelope: TextEnvelope, transactionId: string})
    }

    async signContractInteraction(cborHex: string): Promise<SResult<{signedTx: string}>>{
        /* import * as wn from "npm:@marlowe.io/wallet/nodejs";
        import * as clientModule from "npm:@marlowe.io/runtime-rest-client";
        import * as w from "npm:@marlowe.io/wallet";
        import { MarloweVersion } from "npm:@marlowe.io/language-core-v1/version";
        import * as core from "npm:@marlowe.io/runtime-core";
        const pk = await Deno.readTextFile("./key.sk")
        const BLProjectId = await stringOrError("BLOCKFROST_API_KEY")
        const context = new wn.Context(BLProjectId, "https://cardano-preprod.blockfrost.io/api/v0", "Preprod")
        const wallet = await wn.SingleAddressWallet.Initialise(context, pk)
        const signedTx = await wallet.signTx(cborHex) */
        return success({} as {signedTx: string})
    }

    async submitContractInteraciton(signedTx: string, contractId: string, transactionId: string): Promise<SResult<{TxID: string}>>{
        /* const funClient = clientModule.mkFPTSRestClient(this.webServerURl)
        const submitResponse = await (funClient.contracts.contract.transactions.transaction.put(contractId, transactionId, signedTx))() */
        return success({} as {TxID: string})
    }

    async retriveAssetsFromContract(){}
}