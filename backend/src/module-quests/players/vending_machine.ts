import axios from "axios";
import NodeCache from "node-cache"
import { Request } from "express-jwt";
import { Response, NextFunction } from "express";
import { MAX_DS_PER_TX, 
         TIME_BETWEEN_TX, 
         TIME_IN_MEMORY_FOR_REWARD,
         TX_LIMIT,
         TIME_BLOCKED,
         DS_DECIMAL
    } from "../app/settings";
import { InMemoryTx } from "../app/types";
import { logger } from "../app/middleware/winston_middleware";

const Cache = new NodeCache({deleteOnExpire: true});


// FUNCTION THAT ADDS A DRAGONSILVER REWARD TO THE VENDING MACHINE
async function deliverReward(stakeAddress: string, amount: number){
    const URL_PREFIX = process.env.NODE_ENV == "production" ? "vm" : "vmtest"
    const API_KEY = process.env.NODE_ENV == "production" ? process.env.VM_MAINNET_API_KEY : process.env.VM_TESTNET_API_KEY;
    const URL = `https://${URL_PREFIX}.adaseal.eu/api.php?token=${API_KEY}&action=deliver_reward&staking_address=${stakeAddress}&token_id=${process.env.POLICY_ID}&amount=${amount*DS_DECIMAL}&overcommit=false&expiry=20&return_policy=2`
    
    const myRequest = await axios.get(URL).catch(error => {
        throw Error("Request Error")
    });
    
    return true
}

// FUNCTION THAT CHECKS IF THE AMOUNT OF DS TO BE EARNED IS ALLOWED
/*
THIS FUNCTION IS USED INSIDE OF THE FUNCTION "checkTxAddressStatus"
TO MAKE SURE A SINGLE REWARD DOES NOT GIVE YOU MORE THAN THE LIMIT
*/
function validateDsAmount(dsAmount: number): boolean {
    return dsAmount < MAX_DS_PER_TX;
}


// MIDDLEWARE THAT CHECKS IF THE TRANSACTION IS OUT OF THE LIMIT THRESHOLD
/*
PLAYERS CAN NOT SEND MORE THAN ONE REWARD TRANSACTION IN THE 
GIVEN TIME LIMIT
*/
const checkTransactionLimit = (request: Request, response: Response, next: NextFunction) => {
    const stakeAddress  = request.auth!.stake_address

    if (Cache.has(`short_${stakeAddress}`)) {
        logger.warn(`ATTEMPT TO CLAIM REWARDS TOO FAST BY ADDRESS ${stakeAddress}`);
        return response.status(409).json({
            "message": "Unable to request reward",
            "code": "too_many_requests"
        })
    }
    let cacheStatus = Cache.set(`short_${stakeAddress}`, null, TIME_BETWEEN_TX);
    if (!cacheStatus) {
        throw new Error("Transaction could not be stored in memory")
    }
    next()
}

// FUNCTION THAT CHECKS IF THE PLAYER ADDRESS IS BLOCKED
/* 
IF A PLAYER ATTEMPS TO CLAIM A LOT OF DS (MALICIOUSLY) THE ADDRESS WILL
BLOCK FOR A GIVEN AMOUNT OF TIME AND IT WILL NOT BE ABLE TO CLAIM ANY
REWARD
*/
const checkAddressAvailability = (request: Request, response: Response, next: NextFunction) => {
    const stakeAddress  = request.auth!.stake_address

    if (Cache.has(stakeAddress)) {
        let addressTxData: InMemoryTx = Cache.get(stakeAddress)!;
        let isBlocked = addressTxData.is_blocked;

        if (isBlocked) {
            return response.status(409).json({
                "message": "This address exceeded request limit",
                "code": "address_blocked"
            })          
        }
    }

    next()
}

// FUNCTION THAT ADDS A PLAYER TRANSACTION TO MEMORY
/*
TO KEEP TRACK OF THA PLAYERS TRANSACTIONS THEY ARE STORED IN MEMORY
AND STAYS THERE FOR ONE MINUTE TO DETECT DS LICKINGS
*/
function addTxToCache(
    stakeAddress: string, 
    ds: number, 
    timesClaimed: number, 
    isBlocked: boolean,
    ): boolean {

    let addressTxData: InMemoryTx = {
        ds: ds,
        times_claimed: timesClaimed,
        is_blocked: isBlocked
    }
    let time: number = isBlocked ? TIME_BLOCKED : TIME_IN_MEMORY_FOR_REWARD;
    let cacheStatus = Cache.set(stakeAddress, addressTxData, time);

    if (!cacheStatus) {
        throw new Error("Transaction could not be stored in memory")
    }
    
    return true
}

// FUNCTIONS THAT KEEPS TRACK OF THE PLAYERS TRANSACTIONS
/*
IF THE PLAYER EXCEEDS A GIVEN AMOUNT OF TRANSACTIONS PER MINUTE
ITS ADDRESS WILL BE BLOCKS AND WILL NOT BE ABLE TO CLAIM FOR A GIVEN
AMOUNT OF TIME
*/
function checkTxAddressStatus(dsAmount: number, stakeAddress: string){
    if (!validateDsAmount(dsAmount)) throw new Error("Too much dragon silver")

    /*
    CACHE OBJ RETURNS ds, times_claimed, is_blocked
     */

    if (!Cache.has(stakeAddress)) {
        addTxToCache(stakeAddress, dsAmount, 1, false);
        return true
    }

    let addressTxData: InMemoryTx = Cache.get(stakeAddress)!;

    if (addressTxData.times_claimed >= TX_LIMIT) {
        addTxToCache(stakeAddress, dsAmount, addressTxData.times_claimed, true);
        return false
    }
    addTxToCache(stakeAddress, dsAmount + addressTxData.ds, addressTxData.times_claimed + 1, false);
    return true
}

export {
    deliverReward,
    validateDsAmount,
    checkTransactionLimit,
    checkTxAddressStatus,
    checkAddressAvailability
}