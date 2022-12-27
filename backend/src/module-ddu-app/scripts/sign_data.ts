import { COSESign1, HeaderMap, Label } from "@emurgo/cardano-message-signing-nodejs"
import { PublicKey, Ed25519Signature, Address } from "@emurgo/cardano-serialization-lib-nodejs"
import { decode, encode } from "cbor"
import { BufferLike } from "cbor/types/lib/decoder";
import ApiError from "../error/api_error";
const { Buffer } = require('buffer');

interface ISignedData {
    payload: Uint8Array,
    publicKey: PublicKey,
    data: Uint8Array,
    signature: Ed25519Signature,
    address: Address,
    verifyPayload(payload: string): Boolean,
    verifyStakeAddress(address: string): Boolean,
    verify(address: string, payload: string): Boolean,
}

//CHECKME: esto es como la deficinion de funciona pero no se si es la mejor forma de hacerlo
class SignedData implements ISignedData {
    payload: Uint8Array;
    publicKey: PublicKey;
    data: Uint8Array;
    signature: Ed25519Signature;
    address: Address;

    constructor(signed: string, key: BufferLike) {
        // Why are you calling Buffer.from twice? as far as i can tell that does not affect the bufffer 
        let message: COSESign1 = COSESign1.from_bytes(Buffer.from(Buffer.from(signed, 'hex'), 'hex'));
        let headermap: HeaderMap = message.headers().protected().deserialized_headers();
        this.address = Address.from_bytes(headermap.header(Label.new_text('address'))!.as_bytes()!)
        //this -2 worked for my wallet but is the part im not sure about being always the same
        this.publicKey = PublicKey.from_bytes(Object.fromEntries(decode(key))['-2'])
        this.payload = message.payload()!;
        this.signature = Ed25519Signature.from_bytes(message.signature());
        this.data = message.signed_data().to_bytes();
    }

    verifyPayload(payload: string): Boolean {
        return Buffer.from(this.payload, 'hex').toString() == payload;
    }

    verifyStakeAddress(address: string): Boolean {
        return this.address.to_bech32() == address;
    }

    verify(address: string, payload: string): Boolean {
        if (!this.verifyPayload(payload)) throw new ApiError(409, "signature_not_valid", "Signature is not valid");
        if (!this.verifyStakeAddress(address)) throw new ApiError(409, "signature_not_valid", "Signature is not valid");
        return this.publicKey.verify(this.data, this.signature);
    }
}

export {
    SignedData,
    ISignedData
}
