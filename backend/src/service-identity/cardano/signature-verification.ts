import crypto from "crypto"

import { SignatureVerificationState, TransactionVerificationState } from "./signature-verification-db"
import { Attempt, success, failed } from "../../tools-utils"
import { Wallet } from "../../tools-cardano"
import { LoggingContext } from "../../tools-tracing"

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

export const createAuthTxState = async (userId: string, stakeAddress: string, rawTransaction: string, validFromSlot: string, validToSlot: string, transferedAmmount: string): Promise<{status: "ok", authStateId: string} | {status: "failed", reason: string}> => {
    try{
        const authState = await TransactionVerificationState.create({userId, stakeAddress, rawTransaction, validFromSlot, validToSlot, transferedAmmount})
        return {status: "ok", authStateId:authState.stateId}
    }catch(e: any){
        console.log(e)
        return {status: "failed", reason: e.message}
    }
    
}

export const validateAuthState = async (authStateId: string, tx: string, userId: string): Promise<{isValid: true, stakeAddress: string} | {isValid:false, reason: string}> => {
    try {
        const instance = await TransactionVerificationState.findByPk(authStateId)
        if (!instance) throw new Error("No State found with provided Id")
        await instance.destroy()
        if (instance.rawTransaction !== tx) throw new Error("State transactions do not match")
        if (instance.userId !== userId) throw new Error("State does not belong to user")
        return{isValid: true, stakeAddress: instance.stakeAddress}
    }catch(e: any){
        return {isValid: false, reason: e.message}
    }
    
}

export const removeState = async (authStateId: string, logger?: LoggingContext): Promise<{status: "ok"} | {status: "invalid", reason: string}> => {
    try {
        const instance = await TransactionVerificationState.findByPk(authStateId)
        if (!instance) throw new Error("No State found with provided Id")
        await instance.destroy()
        return {status: "ok"}
    }catch(e: any){
        logger?.log.error(e.message ?? e)
        return {status: "invalid", reason: e.message}
    }
    
}