import { Constr, Data, Lucid, MintingPolicy, Script, applyParamsToScript, fromText, toLabel } from "lucid-cardano"

export type CompiledValidator = {
    title: string
    compiledCode: string
  }
  
export type CIP26Metadata = {
      subject: string,
      name: string,
      description: string,
      policy? : string,
      ticker?: string,
      url?: string,
      logo?: string,
      decimals?: string 
  }

export type MintResult
    = { policyId: string, areTokensMinted: true, refereceName: string, TxHash: string }
    | { policyId: string, areTokensMinted: false }

const lockDate: BigInt = BigInt(Date.now() + 1000 * 60 * 60 * 1) // 1 Hour from now

export const parametrizeContract = async (lucidWallet: Lucid, script: Script): Promise<Script> => {
    const ownerPaymentCredential = lucidWallet.utils.getAddressDetails(await lucidWallet.wallet.address()).paymentCredential
    if (!ownerPaymentCredential) throw new Error("walllet does not have payment credential, could not set as owner")
    const parametrizedScript = applyParamsToScript(script.script, [ownerPaymentCredential.hash, lockDate])
    return { type: "PlutusV2", script: parametrizedScript }
}

export const mint = async (lucidWallet: Lucid, script: MintingPolicy): Promise<MintResult> => {
    try {
        const mintResult = await mintUserAndReferenceTokens(lucidWallet, script, "DragonGold")
        if (!mintResult.areTokensMinted) throw new Error("could not mint the tokens")

        console.log(`Minted asets of policy ${mintResult.policyId} 
                on TxId ${mintResult.TxHash}
                referenceToken ${mintResult.refereceName}`)
        return mintResult
    } catch (e: any) {
        console.error(e)
        throw e
    }
}

export const lock = async (lucidWallet: Lucid, data: { script: string, policyId: string, referenceAssetName: string }) => {
    try {
        const tokeMetadta: CIP26Metadata = {
            subject: data.policyId + "DragonGold",
            name: `Dragon Gold`,
            description: "This is my test token"
        }
        const addMetadataResult = await lockReferenceTokenInScript(lucidWallet, { type: "PlutusV2", script: data.script },
            data.referenceAssetName, tokeMetadta)
        if (!addMetadataResult.addedDatum) throw new Error("could not add Datum " + addMetadataResult.reason)
        console.log(`Added the Datum with a Tx of ${addMetadataResult.TxHash}`)
    } catch (e) {
        console.error(e)
        throw e
    }
}

//minting the reference token on my own address
const mintUserAndReferenceTokens = async (lucidWallet: Lucid, mintingScript: Script, assetnamecontent: string): Promise<MintResult> => {
    const policyId = lucidWallet.utils.mintingPolicyToId(mintingScript)
    
    const userTokenAssetName = `${policyId}${toLabel(333)}${fromText(assetnamecontent)}`
    const referenceTokenAssetName = `${policyId}${toLabel(100)}${fromText(assetnamecontent)}`

    const validityRange = 1000 * 60 * 60 * 1
    const mintRedeemer = Data.void()
    const mintTx = await lucidWallet.newTx()
        .mintAssets({ [referenceTokenAssetName]: BigInt(1) }, mintRedeemer)
        .mintAssets({ [userTokenAssetName]: BigInt("2000000000000000") }, mintRedeemer)
        .addSigner(await lucidWallet.wallet.address())
        .attachMintingPolicy(mintingScript)
        .validFrom(Date.now() - validityRange)
        .validTo(Date.now() + validityRange)
        .complete()
    const mintSignedTx = await mintTx.sign().complete();
    const mintTxHash = await mintSignedTx.submit();
    const mintedTokens = await lucidWallet.awaitTx(mintTxHash)
    if (mintedTokens) return {policyId, areTokensMinted: mintedTokens, refereceName:referenceTokenAssetName, TxHash: mintTxHash }
    else return {policyId, areTokensMinted: mintedTokens}
}

/*
const script = "59015e59015b010000333232323232323232323223223222533300b3370e900018050008a9998059919299980699b87480000044c8c94ccc03cccc8c888cc00cdd6198079808801240200026002002444a66602a00429404c8c94ccc050cdc78010018a5113330050050010033018003375c602c00466016601a00a9000004899911919299980999b87480080044c8c8cdc40008029bad3018001301100214a060220026601a601e6601a601e00490002400066016601a66016601a00a90002401c00e2940dd7180900098058010a50300b00133007300900148008526161322533300d4a02930b180798048009bad001375c0026600200290001111199980399b8700100300b233330050053370000890011806800801001118029baa001230033754002ae6955ceaab9e5573eae855d126011e581c7ab9132ee470e08c22896ce286d7c1bddca27cd5971eeb5ea2646cfc004c01091b0000018f932b71a80001"
const policyId = "fa6c3581c01dce46a36b55fd9cb658fdf463e14ef4c286d2f052b539"
const referenceAssetName = "fa6c3581c01dce46a36b55fd9cb658fdf463e14ef4c286d2f052b539000643b053363854"
*/

const lockReferenceTokenInScript = async (lucidWallet: Lucid, mintingScript: Script, referenceTokenAssetName: string, userTokenMetadata: CIP26Metadata): Promise<{addedDatum: true, TxHash: string} | {addedDatum: false, reason: string}> => {
    try {const contractAddress = lucidWallet.utils.validatorToAddress(mintingScript)
    const datumString = serializeFTMetadata(userTokenMetadata)
    const referenceTokenDatumTx = await lucidWallet.newTx()
                .payToContract(contractAddress, {inline:datumString }, {[referenceTokenAssetName]: BigInt(1)})
                .complete()
    const referenceTokenDatumSignedTx = await referenceTokenDatumTx.sign().complete()
    const referenceDatumTxHash = await referenceTokenDatumSignedTx.submit()
    const addedDatumToRefereceToken = await lucidWallet.awaitTx(referenceDatumTxHash)
    if (addedDatumToRefereceToken) return {addedDatum: true, TxHash: referenceDatumTxHash}
    else return {addedDatum: false, reason: "awaitTx returned false"}}
    catch (e: any){
        console.log(e)
        return {addedDatum: false, reason: e.message}
    }
}

const serializeFTMetadata = (metadata: CIP26Metadata): string => {
  const mapSchema = Data.Map(Data.Bytes(),Data.Bytes())
  type MetadataMapType = Data.Static<typeof mapSchema>
  const metadataMap: MetadataMapType = new Map()
  for (const key in metadata) {
    if (metadata[key as keyof CIP26Metadata]) {
      metadataMap.set(fromText(key), fromText(metadata[key as keyof CIP26Metadata] as string))
    }
  }
  const datumConstr = new Constr<Data>(0, [metadataMap, BigInt(1)])
  const serializeDatum = Data.to(datumConstr)
  return serializeDatum
}
