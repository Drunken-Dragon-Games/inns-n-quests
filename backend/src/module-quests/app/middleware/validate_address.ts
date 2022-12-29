import { Response, NextFunction} from "express"
import { Request } from "express-jwt"
import { ValidateAddress } from "../types";

////////////////// MIDDLEWARE THAT VALIDATES THE STAKE ADDRESS  ////////////////////
/* 
CHECKS IF THE PATH IS ONE THAT DOES NOT NEED AUTHENTICATION
VALIDATES ADDRESS
RETURNS 400 IF ADDRESS IS NOT VALID
*/
const validateAddressMiddleware = (request: Request, response: Response, next: NextFunction) => {
    if (!request.path.includes("validate") && request.auth!.stake_address != undefined) {        
        let stakeAddress = request.auth!.stake_address;
    
        if (!validateAddress(stakeAddress)) {
    
            return response.status(400).json({
                message: "Stake Addres is not valid",
                code: "address_not_valid"
            });
    
        }
    }
    
    next();
}

////////////////// FUNCTION THAT VALIDATES ADDRESS  ////////////////////
/* 
CHECKS IF WE ARE IN PRODUCTION OR TEST ENVIRONMENT
CHECKS IF THE ADDRESS HAS ANY OF THE FORBIDDEN CHARACTERS
CHECKS IF THE ADDRESS IS A TESTNET OR MAINNET ADDRESS
*/
const validateAddress = (stakeAddress: string): boolean => {
    const specialChars = /[`!@#$%^&*()\-=\[\]{};':"\\|,.<>\/?~]/;

    const validate: ValidateAddress = process.env.CARDANO_NETWORK !== "mainnet" ? {
            stakeAddressLength: stakeAddress.length !== 64,
            includesStringTest: !stakeAddress.includes("test"),
        } : {
            stakeAddressLength: stakeAddress.length !== 59,
            includesStringTest: stakeAddress.includes("test"),
        }
    validate.hasSpecialChars = specialChars.test(stakeAddress);
    
    if (validate.stakeAddressLength ||
        validate.includesStringTest ||
        validate.hasSpecialChars ||
        typeof stakeAddress != "string"
        ) {
        return false;
    }
    return true;
}

export {
    validateAddressMiddleware,
    validateAddress
}