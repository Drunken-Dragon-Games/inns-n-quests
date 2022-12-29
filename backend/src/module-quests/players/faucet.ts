import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import cbor from "cbor";
import { blockfrost } from "../blockfrost/intializer";
import { FEE_ADDRESS,
         DD_FEE_AMOUNT,
         TX_TTL } from "../app/settings"
import ApiError from "../app/error/api_error"
import { NFTMetadata } from "./app-logic/testnet/random-nft"

interface IUtxoAmount {
  unit: string,
  quantity: string
}

interface IUtxo {
  tx_hash?: string,
  tx_index?: number,
  output_index?: number, 
  amount?: IUtxoAmount[]
  block?: string,
  data_hash?: string | undefined,
  inline_datum?: string | undefined,
  reference_script_hash?: string | undefined
}


////////FUNCTION THAT CREATES THE MINTING TX FOR TESTNET NFTS///////

const createMintNftTx = async (
  stakeAddress: string,
  assetName: string | ArrayBuffer | { valueOf(): ArrayBuffer | SharedArrayBuffer; },
  nftMetadata: NFTMetadata
): Promise<string> => {
  const FEE = 50000000;
  let utxos;
  let currentSlot;
  let receivingAddress;
  try {
    receivingAddress = (await blockfrost.accountsAddresses(stakeAddress))[0].address;    
    currentSlot = (await blockfrost.blocksLatest()).slot
    utxos = await blockfrost.addressesUtxosAll(receivingAddress);
  } catch (error) {
    throw new ApiError(404, "address_not_found", "Address not found")
  }

  /*********** SET ADDRESSES TO CARDANOWASM ***********/
  const addr: CardanoWasm.Address = CardanoWasm.Address.from_bech32(receivingAddress);

  /********** SET TX CONFIGURATION **********/
  const txBuilder = getTxBuilder();

  /**************** GENERATE MINTSCRIPT ****************/
  const mintScript = generateMintScript()

  /*********** SET TX OUTPUTS TO CARDANOWASM ***********/ 
  txBuilder.add_mint_asset_and_output_min_required_coin(
    mintScript,
    CardanoWasm.AssetName.new(Buffer.from((assetName as string))),
    CardanoWasm.Int.new_i32(1),
    CardanoWasm.TransactionOutputBuilder.new().with_address(addr).next()
  );

  /*********** ADD NFT METADATA ***********/
  const policyId = Buffer.from(mintScript.hash().to_bytes()).toString("hex");
  const metadata = {
    [policyId]: {
      [assetName as string]: nftMetadata,
    },
  };
  txBuilder.add_json_metadatum(
    CardanoWasm.BigNum.from_str("721"),
    JSON.stringify(metadata)
  );

  /*********** HANDLE UTXO CON SELECTION ***********/ 
  let inputSet = largestFirstCSA(
    parseInt(txBuilder.get_explicit_output().coin().to_str()) + FEE,
    utxos,
    20
  ) 

  /*********** SET TX INPUTS TO CARDANOWASM ***********/ 
  const privKeyHash = CardanoWasm.BaseAddress.from_address(addr)!
  .payment_cred()
  .to_keyhash();

  inputSet.forEach((input: IUtxo) => {
    let txBuilderInput = CardanoWasm.TransactionInput.new(
      CardanoWasm.TransactionHash.from_bytes(Buffer.from(input.tx_hash!, "hex")),
      input.tx_index!
    )  
    let txBuilderAmount = CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(input.amount!.find((asset: any) => asset.unit == "lovelace")!.quantity))

    const multiasset = CardanoWasm.MultiAsset.new()
    input.amount!.forEach((asset: any) => {
      if (asset["unit"] == "lovelace") return
      const policyId = asset["unit"].slice(0, 56)
      const assetName = asset["unit"].slice(56, asset["unit"].length)      
      const assetNameByte = Buffer.from(assetName, "hex").toString();      
      const hash = CardanoWasm.ScriptHash.from_bytes(Buffer.from(policyId, "hex"));      
      const cardanoAsset = CardanoWasm.AssetName.new(Buffer.from(assetNameByte));
      const value = CardanoWasm.BigNum.from_str(asset["quantity"]);
      multiasset.set_asset(hash, cardanoAsset, value)
    })
    txBuilderAmount.set_multiasset(multiasset)

    txBuilder.add_key_input(
      privKeyHash!,
      txBuilderInput,
      txBuilderAmount
    );
  })

  /*********** SET TX TTL BASED ON SLOT NUMBER ***********/ 
  const txTtl: number = currentSlot! + TX_TTL;
  txBuilder.set_ttl(txTtl);
  
  /*********** ADD CHANGE TO TRANSACTION ***********/ 
  txBuilder.add_change_if_needed(addr);

  /*********** BUILD AND HEX THE TX ***********/
  const unsignedTx = txBuilder.build_tx();
  const hexTx = Buffer.from(unsignedTx.to_bytes()).toString("hex");

  return hexTx;
};

const signMintTx = async (serializedTx: string, txWitness: any, policy: any) => {
  const policyPrivateKey = CardanoWasm.PrivateKey.from_normal_bytes(
    cbor.decodeFirstSync(
      policy
    )
  );
  // HASH THE TRANSACTION
  const witnesses = CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(txWitness, "hex"));
  const tx = CardanoWasm.Transaction.from_bytes(Buffer.from(serializedTx, "hex"));

  const txBody = tx.body()
  const txHash = CardanoWasm.hash_transaction(txBody);

  // CREATE WITNESSES
  const vkeyWitnesses = witnesses.vkeys()
  vkeyWitnesses!.add(CardanoWasm.make_vkey_witness(txHash, policyPrivateKey));
  witnesses.set_vkeys(vkeyWitnesses!);
  witnesses.set_native_scripts;
  const witnessScripts = CardanoWasm.NativeScripts.new();
  witnessScripts.add(generateMintScript());
  witnesses.set_native_scripts(witnessScripts);

  const len = witnesses.vkeys()?.len()

  const signedTxObj = CardanoWasm.Transaction.new(
    txBody,
    witnesses,
    tx.auxiliary_data()
  );

  const signedTx = Buffer.from(signedTxObj.to_bytes()).toString("hex"); 
  
  const mintTx = await submitTx(signedTx);
  return mintTx
}

const submitTx = async (signedTx: string) => {
  try {
    const response = await blockfrost.txSubmit(signedTx);
    return response;
  } catch (error) {
    throw new ApiError(400, "tx_not_submitted", "Transaction was not submitted");
  }
}

const generateMintScript = () => {
  const policyAddr = getPolicyAddress()

  const policyKeyHash = CardanoWasm.BaseAddress.from_address(policyAddr)!
  .payment_cred()
  .to_keyhash();

  const keyHashScript = CardanoWasm.NativeScript.new_script_pubkey(
    CardanoWasm.ScriptPubkey.new(policyKeyHash!)
  );

  const scripts = CardanoWasm.NativeScripts.new();
  scripts.add(keyHashScript);


  const mintScript = CardanoWasm.NativeScript.new_script_all(
    CardanoWasm.ScriptAll.new(scripts)
  );

  return mintScript;
}

const getPolicyAddress = () => {
  const policyPrivateKey = CardanoWasm.PrivateKey.from_normal_bytes(
    cbor.decodeFirstSync(
      process.env.POLICY_PRIVATE_KEY!
    )
  );

  const policyPubKey = policyPrivateKey.to_public();

  const policyAddr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet().network_id(),
    CardanoWasm.StakeCredential.from_keyhash(policyPubKey.hash()),
    CardanoWasm.StakeCredential.from_keyhash(policyPubKey.hash())
  ).to_address();

  return policyAddr;
}


const mintDragonSilver = async (amount: number, stakeAddress: string) => {
  let utxos;
  let currentSlot;
  let receivingAddress
  try {
    receivingAddress = (await blockfrost.accountsAddresses(stakeAddress))[0].address;
    currentSlot = (await blockfrost.blocksLatest()).slot
    utxos = await blockfrost.addressesUtxosAll(receivingAddress);
  } catch (error) {
    throw new ApiError(404, "address_not_found", "Address not found")
  }
  // const signingAddressInString = "addr_test1qpal0683mc6tfx5f6qrzc0da4hkhjwdvjsx6s87j8yww83ak2t2y7eh9944k39vx9jlxz2gl43ylzrwt9ad0xm2ed2mq3jwzkn";
  // const addr: CardanoWasm.Address = CardanoWasm.Address.from_bech32(signingAddressInString);
  
  /*********** SET ADDRESSES TO CARDANOWASM ***********/
  const recAddr: CardanoWasm.Address = CardanoWasm.Address.from_bech32(receivingAddress);
  const feeAddress: CardanoWasm.Address = CardanoWasm.Address.from_bech32(FEE_ADDRESS);

  /********** SET TX CONFIGURATION **********/
  const txBuilder = getTxBuilder();

  /**************** GENERATE MINTSCRIPT ****************/
  const mintScript = generateMintScript()

  /*********** SET TX OUTPUTS TO CARDANOWASM ***********/ 
  txBuilder.add_mint_asset_and_output_min_required_coin(
    mintScript, // MINTSCRIPT
    CardanoWasm.AssetName.new(Buffer.from(("DragonSilver" as string))),
    CardanoWasm.Int.new_i32(amount),
    CardanoWasm.TransactionOutputBuilder.new().with_address(recAddr).next()
  );
  
  const txBuilderDDFeeAmount = CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(DD_FEE_AMOUNT));
  const feeOutput = CardanoWasm.TransactionOutput.new(feeAddress, txBuilderDDFeeAmount);
  txBuilder.add_output(feeOutput);
  
  /*********** HANDLE UTXO CON SELECTION ***********/ 
  let inputSet = largestFirstCSA(
    parseInt(txBuilder.get_explicit_output().coin().to_str()),
    utxos,
    20
  )
  
  /*********** SET TX INPUTS TO CARDANOWASM ***********/ 
  const privKeyHash = CardanoWasm.BaseAddress.from_address(recAddr)!
  .payment_cred()
  .to_keyhash();

  inputSet.forEach((input: IUtxo) => {
    let txBuilderInput = CardanoWasm.TransactionInput.new(
      CardanoWasm.TransactionHash.from_bytes(Buffer.from(input.tx_hash!, "hex")),
      input.tx_index!
    )  
    let txBuilderAmount = CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(input.amount!.find((asset: any) => asset.unit == "lovelace")!.quantity))

    const multiasset = CardanoWasm.MultiAsset.new()
    input.amount!.forEach((asset: any) => {
      if (asset["unit"] == "lovelace") return
      const policyId = asset["unit"].slice(0, 56)
      const assetName = asset["unit"].slice(56, asset["unit"].length)
      
      const assetNameByte = Buffer.from(assetName, "hex").toString();
      const hash = CardanoWasm.ScriptHash.from_bytes(mintScript.hash().to_bytes());
      
      const cardanoAsset = CardanoWasm.AssetName.new(Buffer.from(assetNameByte));
      const value = CardanoWasm.BigNum.from_str(asset["quantity"]);
      multiasset.set_asset(hash, cardanoAsset, value)
    })
    txBuilderAmount.set_multiasset(multiasset)

    txBuilder.add_key_input(
      privKeyHash!,
      txBuilderInput,
      txBuilderAmount
    );
  })
  
  
  /*********** SET TX TTL BASED ON SLOT NUMBER ***********/ 
  const txTtl: number = currentSlot! + TX_TTL;

  txBuilder.set_ttl(txTtl);
  txBuilder.add_change_if_needed(recAddr);
  
  /*********** BUILD AND HEX THE TX ***********/
  const unsignedTx = txBuilder.build_tx();
  const hexTx = Buffer.from(unsignedTx.to_bytes()).toString("hex");
  
  return hexTx;
  
}

const largestFirstCSA = (
  explicitOutput: number,
  initialUTXOSet: any,
  maxInputCount: number
) => {
  if(!initialUTXOSet.length) throw new ApiError(409, "insufficient_balance", "UTxO Balance Insufficient");
  let sortedUTXOs = sortUTXOs(initialUTXOSet);
  
  let selectedUTXOSet = new Array();
  let sumOfValue: number = 0;

  sumOfValue += sortedUTXOs[0].amount.find((asset: IUtxoAmount) => asset.unit == "lovelace").quantity;
  selectedUTXOSet.push(sortedUTXOs.shift());

  while (sumOfValue < explicitOutput) {
    if (selectedUTXOSet.length > maxInputCount) throw new ApiError(409, "input_size_exceeded", "Maximum Input Count Exceeded");
    if (!sortedUTXOs.length) throw new ApiError(409, "insufficient_balance", "UTxO Balance Insufficient");
    sumOfValue += sortedUTXOs[0].amount.find((asset: IUtxoAmount) => asset.unit == "lovelace").quantity;
    selectedUTXOSet.push(sortedUTXOs.shift());
  }

  return selectedUTXOSet;
}

const sortUTXOs = (utxoSet: IUtxo[]) => {
  let sortedUTXOs = new Array();
  let maxUtxo: IUtxo;
  
  for (let i = 0; i < utxoSet.length; i++) {
    maxUtxo = {
      amount: [{ unit: "lovelace", quantity: "0"}]
    }
    utxoSet.forEach((utxo: IUtxo) => { 
      if (parseInt(utxo.amount!.find((asset: IUtxoAmount) => asset.unit == "lovelace")?.quantity!) > 
      parseInt(maxUtxo.amount!.find((asset: IUtxoAmount) => asset.unit == "lovelace")?.quantity!) &&
      !sortedUTXOs.includes(utxo)) {
        maxUtxo = utxo
      }; 
    })
    sortedUTXOs.push(maxUtxo);
  }
  return sortedUTXOs;
}

const getTxBuilder = () => {
  const txBuilder = CardanoWasm.TransactionBuilder.new(
    CardanoWasm.TransactionBuilderConfigBuilder.new()
      .fee_algo(
        CardanoWasm.LinearFee.new(
          CardanoWasm.BigNum.from_str("44"),
          CardanoWasm.BigNum.from_str("155381")
        )
      )
      .coins_per_utxo_word(CardanoWasm.BigNum.from_str("34482"))
      .pool_deposit(CardanoWasm.BigNum.from_str("500000000"))
      .key_deposit(CardanoWasm.BigNum.from_str("2000000"))
      .max_value_size(50000)
      .max_tx_size(163840)
      .build()
  );
  return txBuilder;
}

export {
  createMintNftTx,
  signMintTx,
  mintDragonSilver
}