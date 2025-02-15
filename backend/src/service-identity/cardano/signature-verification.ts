import crypto from "crypto"

import { Wallet } from "../../tools-cardano"
import { Attempt, failed, succeeded } from "../../tools-utils"
import { AssosiationOutcome, CompleteAuthStateResult } from "../models"
import { SignatureVerificationState, TransactionVerificationState } from "./signature-verification-db"

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
        return validation ? succeeded(instance.address) : failed
    }
    else return failed
}

export const createAuthTxState = async (userId: string, stakeAddress: string, txHash: string): Promise<{status: "ok", authStateId: string} | {status: "failed", reason: string}> => {
    try{
        const authState = await TransactionVerificationState.create({userId, stakeAddress, txHash, state:{ctype: "pending"}})
        return {status: "ok", authStateId:authState.stateId}
    }catch(e: any){
        return {status: "failed", reason: e.message}
    }
    
}

export const validateAuthState = async (authStateId: string, userId: string, txHash: string): Promise<{isValid: true, stakeAddress: string} | {isValid:false, reason: string}> => {
    try {
        const instance = await TransactionVerificationState.findByPk(authStateId)
        if (!instance) throw new Error("No State found with provided Id")
        if (instance.txHash !== txHash) throw new Error("State transactions do not match")
        if (instance.userId !== userId) throw new Error("State does not belong to user")
        return{isValid: true, stakeAddress: instance.stakeAddress}
    }catch(e: any){
        return {isValid: false, reason: e.message}
    }
    
}

export const updateAuthState = async (authStateId: string, status: AssosiationOutcome): Promise<CompleteAuthStateResult> => {
    try {
        const instance = await TransactionVerificationState.findByPk(authStateId)
        if (!instance) throw new Error("No State found with provided Id")
        instance.state = status
        await instance.save()
        return{status: "ok"}
    }catch(e: any){
        return {status: "invalid", reason: e.message}
    }
}