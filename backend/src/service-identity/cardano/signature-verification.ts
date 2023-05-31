import crypto from "crypto"

import { SignatureVerificationState, TransactionVerificationState } from "./signature-verification-db"
import { Attempt, success, failed } from "../../tools-utils"
import { Wallet } from "../../tools-cardano"

export const generateNonce = async (address: string): Promise<string> => {
    const nonce = crypto.randomBytes(20).toString('hex');
    const existing = await SignatureVerificationState.findOne({ where: { address } })
    if (existing) {
        existing.nonce = nonce
        await existing.save()
    } else 
        await SignatureVerificationState.create({ address, nonce })
    return nonce
}

export const verifySig = async (signedNonce: string, nonce: string, key: string): Promise<Attempt<string>> => {
    const instance = await SignatureVerificationState.findOne({ where: { nonce } })
    if (instance) {
        const validation = Wallet.verifySignature(signedNonce, key, nonce, instance.address)
        await instance.destroy()
        return validation ? success(instance.address) : failed
    }
    else return failed
}

export const createAuthTxState = async (userId: string, stakeAddress: string, txId: string) => {
    const authState = await TransactionVerificationState.create({userId, stakeAddress, txId})
    return authState.stateId
}