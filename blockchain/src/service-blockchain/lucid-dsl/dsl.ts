import { Lucid, NativeScript, Transaction, fromText} from "https://deno.land/x/lucid@0.10.6/mod.ts"
import { Resolution, succeed, fail } from "../../utypes.ts"
import { CardanoTransactionInfo, TransactionHashReponse, SubmitTransactionReponse } from "../models.ts"
import { SecureSigningService } from "../../service-secure-signing/service-spec.ts"

const validityRange = 1000 * 60 * 10

export class TransactionDSL {

    constructor(private lucidFactory: () => Promise<Lucid>,
                private secureSigningService: SecureSigningService
    ){}
    

    async buildSelfTx (address: string): Promise<Resolution<CardanoTransactionInfo>> {
        try{
            const lucidInstance = await this.lucidFactory()
            lucidInstance.selectWalletFrom({ address })
            const tx = await lucidInstance.newTx()
                .payToAddress(address, {lovelace: BigInt("1000000")})
                .complete()
            const rawTransaction = tx.toString()
            const txHash = tx.toHash()

            return succeed({rawTransaction, txHash})
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
    }

    async buildMintTx(address: string, policy: NativeScript, assetUnit: string, quantityToClaim:string, feeInfo?: {feeAddress: string, feeAmount: string}): Promise<Resolution<CardanoTransactionInfo>> {
        const lucidInstance = await this.lucidFactory()
        lucidInstance.selectWalletFrom({ address })
        const mintingPolicy = lucidInstance.utils.nativeScriptFromJson(policy)
        const policyId = lucidInstance.utils.mintingPolicyToId(mintingPolicy)
        const unit = policyId + fromText(assetUnit)
        const tx = lucidInstance.newTx()
            .mintAssets({ [unit]: BigInt(quantityToClaim) })
            .payToAddress(address, { [unit]: BigInt(quantityToClaim) })
            .attachMetadata(133722, { "dd-tx-type": "asset-claim" })
            .validTo(Date.now() + validityRange)
            .attachMintingPolicy(mintingPolicy)

        if (feeInfo) tx.payToAddress(feeInfo.feeAddress, { lovelace: BigInt(feeInfo.feeAmount) })
        
        const completeTx = await tx.complete()
        const rawTransaction = completeTx.toString()
        const policiAprovedRawTrasnaction = await this.secureSigningService.signWithPolicy(policyId, rawTransaction)
        if (policiAprovedRawTrasnaction.status !== "ok") return {status: "invalid", reason: `could not sign Mint Tx: ${policiAprovedRawTrasnaction.reason}`}
        const txHash = completeTx.toHash()

        return succeed({rawTransaction: policiAprovedRawTrasnaction.value, txHash})
    }

    async hashSerializedTransaction (serializedTrasnaction: Transaction): Promise<TransactionHashReponse> {
        try{
            const lucidInstance = await this.lucidFactory()
            const tx = lucidInstance.fromTx(serializedTrasnaction)
            const txHash = tx.toHash()
            return {status: "ok", value: txHash}
        }catch(e){
            console.log(e)
            return {status: "invalid", reason: e.message ?? JSON.stringify(e, null, 4)}
        }
    }

    async submitSerializedTransaction (serializedTrasnaction: Transaction): Promise<SubmitTransactionReponse> {
        try{
            const lucidInstance = await this.lucidFactory()
            const tx = lucidInstance.fromTx(serializedTrasnaction)
            const signedTx = await tx.complete()
            const txHash = await signedTx.submit()
            
            return {status: "ok", value: txHash}
        }catch(e){
            console.log(e)
            return {status: "invalid", reason: e.message ?? JSON.stringify(e, null, 4)}
        }
    }
}   
