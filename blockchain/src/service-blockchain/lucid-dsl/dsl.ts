import { Lucid } from "../../deps.ts"
import { SecureSigningService } from "../../service-secure-signing/service-spec.ts"
import { Resolution, fail, succeed } from "../../utypes.ts"
import { CardanoTransactionInfo, SubmitTransactionReponse, TransactionHashReponse } from "../models.ts"

//TODO: hanlde this as an env variable
const validityRange = 1000 * 60 * 10

export class TransactionDSL {

    constructor(private lucidFactory: () => Promise<Lucid.Lucid>,
                private secureSigningService: SecureSigningService
    ){}

    async buildSelfTx (address: string): Promise<Resolution<CardanoTransactionInfo>> {
        try{
            const lucidInstance = await this.lucidFactory()
            lucidInstance.selectWalletFrom({ address })
            const tx = await lucidInstance.newTx()
                .payToAddress(address, {lovelace: BigInt("1000000")})
                .validTo(Date.now() + validityRange)
                .complete()
            const rawTransaction = tx.toString()
            const txHash = tx.toHash()

            return succeed({rawTransaction, txHash})
        }
        catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
    }

    async buildMintTx(address: string, asset: {policyId: string, unit:string}, quantityToClaim:string, feeInfo?: {feeAddress: string, feeAmount: string}): Promise<Resolution<CardanoTransactionInfo>> {
        try {
            const policyResponse = this.secureSigningService.policy(asset.policyId)
            if (policyResponse.status !== "ok") return {status: "invalid", reason: `Could not build Tx because: ${policyResponse.reason}`}
            
            const lucidInstance = await this.lucidFactory()
            lucidInstance.selectWalletFrom({ address })

            const unit = asset.policyId + Lucid.fromText(asset.unit)
            const tx = lucidInstance.newTx()
                .mintAssets({ [unit]: BigInt(quantityToClaim) })
                .payToAddress(address, { [unit]: BigInt(quantityToClaim) })
                .validTo(Date.now() + validityRange)
                .attachMetadata(133722, { "dd-tx-type": "asset-claim" })
                .attachMintingPolicy(policyResponse.value)

            if (feeInfo) tx.payToAddress(feeInfo.feeAddress, { lovelace: BigInt(feeInfo.feeAmount) })

            const completeUnsignedTx = await tx.complete()

            const signedTransaction = await this.secureSigningService.signWithPolicy(asset.policyId, completeUnsignedTx.toString())
            if (signedTransaction.status !== "ok") return {status: "invalid", reason: `Could not build mint Tx because: ${signedTransaction.reason}`}
            
            const txHash = completeUnsignedTx.toHash()

            return succeed({rawTransaction: signedTransaction.value, txHash})
        }catch(e){
            return fail(e.message ?? JSON.stringify(e, null, 4))
        }
    }

    async buildBulkMintTx(address: string, assetsInfo: {[policyId: string]: {unit:string, quantityToClaim:string}[]}): Promise<Resolution<CardanoTransactionInfo>>{
        const lucidInstance = await this.lucidFactory();
        lucidInstance.selectWalletFrom({ address });
        const mintRedeemer = Lucid.Data.to(new Lucid.Constr(0, []));
        const tx = lucidInstance.newTx();
    
        for (const policyId of Object.keys(assetsInfo)) {
            const policyResponse = this.secureSigningService.policy(policyId);
            
            if (policyResponse.status !== "ok") {
                return {status: "invalid", reason: `Could not build wiht policy: ${policyId}, Tx because: ${policyResponse.reason}`};
            }
    
            tx.attachMintingPolicy(policyResponse.value);
            const assets = assetsInfo[policyId].reduce((acc, assetInfo) => {
                acc[`${policyId}${Lucid.fromText(assetInfo.unit)}`] = BigInt(assetInfo.quantityToClaim);
                return acc;
            }, {} as Record<string, bigint>);
            
            tx.mintAssets(assets, mintRedeemer)
            .payToAddress(address, assets);
        }
    
        const completeUnsignedTx = await tx.complete();
    
        const txHash = completeUnsignedTx.toHash();
        return succeed({rawTransaction: completeUnsignedTx.toString(), txHash});
    }
    

    async hashSerializedTransaction (serializedTrasnaction: Lucid.Transaction): Promise<TransactionHashReponse> {
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

    async submitSerializedTransaction (serializedTrasnaction: Lucid.Transaction): Promise<SubmitTransactionReponse> {
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
