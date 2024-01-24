import { Lucid } from "../deps.ts"

export class FlexibleTxBuilder {
    private tasks: ((that: FlexibleTxBuilder) => unknown)[]
    txBuilder: Lucid.C.TransactionBuilder
    constructor(txBuilderConfig: Lucid.C.TransactionBuilderConfig) {
        this.txBuilder = Lucid.C.TransactionBuilder.new(txBuilderConfig)
        this.tasks = []
      }

    static newTx(txBuilderConfig: Lucid.C.TransactionBuilderConfig): FlexibleTxBuilder {
      return new FlexibleTxBuilder(txBuilderConfig)
    }

    addInputFromAddress(payinglucid: Lucid.Lucid, recivingAddress: string, assets: Lucid.Assets): FlexibleTxBuilder{
      this.tasks.push((that) => {
          const output = Lucid.C.TransactionOutput.new(
            addressFromWithNetworkCheck(recivingAddress, payinglucid),
            Lucid.assetsToValue(assets),
          )
          that.txBuilder.add_output(output)
        })
      return this
    }

    validTo(lucid: Lucid.Lucid, unixTime: Lucid.UnixTime): FlexibleTxBuilder {
      this.tasks.push((that) => {
        const slot = lucid.utils.unixTimeToSlot(unixTime)
        that.txBuilder.set_ttl(Lucid.C.BigNum.from_str(slot.toString()))
      })
      return this
    }
    
    attachMetadata(label: Lucid.Label, metadata: Lucid.Json): FlexibleTxBuilder {
        this.tasks.push((that) => {
          that.txBuilder.add_json_metadatum(
            Lucid.C.BigNum.from_str(label.toString()),
            JSON.stringify(metadata),
          )
        })
        return this
    }

    async complete(otherLucid: Lucid.Lucid, feePayingLucid: Lucid.Lucid): Promise<Lucid.TxComplete> {
      let task = this.tasks.shift()
      while (task) {
        await task(this)
        task = this.tasks.shift()
      }
  
      const utxos1 = await feePayingLucid.wallet.getUtxosCore()
      const changeAddress1: Lucid.C.Address = addressFromWithNetworkCheck((await feePayingLucid.wallet.address()),feePayingLucid)

      const utxos2 = await otherLucid.wallet.getUtxosCore()
      const changeAddress2: Lucid.C.Address = addressFromWithNetworkCheck((await otherLucid.wallet.address()),otherLucid)

      this.txBuilder.add_inputs_from( utxos1, changeAddress1, Uint32Array.from([200, 1000, 1500, 800,800, 5000]))
      this.txBuilder.add_inputs_from( utxos2, changeAddress2, Uint32Array.from([200, 1000, 1500, 800,800, 5000]))
      
  
      this.txBuilder.balance(changeAddress1, undefined)
  
      return new Lucid.TxComplete(feePayingLucid, await this.txBuilder.construct( utxos1, changeAddress1, true))
    }
}


function addressFromWithNetworkCheck(address: string, lucid: Lucid.Lucid): Lucid.C.Address {
    const addressDetails = lucid.utils.getAddressDetails(address)
    const actualNetworkId = Lucid.networkToId(lucid.network)
    if (addressDetails.networkId !== actualNetworkId) {
      throw new Error(`Invalid address: Expected address with network id ${actualNetworkId}, but got ${addressDetails.networkId}`)
    }
    return Lucid.C.Address.from_bech32(address)
  }