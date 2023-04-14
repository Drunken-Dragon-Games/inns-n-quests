import { Response, NextFunction} from "express"
import { COOKIE_EXPIRACY } from '../app/settings.js'
import { AuthRequest } from "../app/types.js";
import { validateAddress } from "../app/middleware/validate_address.js";
import { Request } from "express-jwt";
import { blockfrost } from "../blockfrost/intializer.js";
import ApiError from "../app/error/api_error.js";
import { getRandomNFT, getCollectionPolicy } from "./app-logic/testnet/random-nft.js";
import { handleSignVerification, handleRefreshToken } from "./app-logic/authentication.js";
// import { registry } from "../app/utils.js";
import { withTracing } from "../base-logger.js"
import { IdentityService } from "../../service-identity.js";
import { AssetManagementService } from "../../service-asset-management.js";
import { onlyPolicies, WellKnownPolicies } from "../../registry-policies.js";

////////////////// GET NONCE ////////////////////
/* 

VIEW THAT RECEIVES A STAKE ADDRESS FROM THE CLIENT  
RETURNS AN AUTHENTICATION NONCE TO BE SIGN BY THE NAMI WALLET

*/
const getAuthenticationNonce = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const { stakeAddress }= request.body

    try {
        if(typeof stakeAddress !== "string" || !validateAddress(stakeAddress)) throw new ApiError (400, "address_not_valid", "Stake Addres is not valid")
        const sdkResponse =  await identityService.createSigNonce(stakeAddress, logger)
        if (sdkResponse.status == "bad-address") 
            throw new ApiError(401, "bad_credentials", "Unauthorized")
        return response.status(201).json({
                message: "Instance created",
                code: "instance_created",
                nonce: sdkResponse.nonce
            })
    } catch (error: any) { 
        next(error)
    }
}

////////////////// SIGNATURE VERIFICATION AND PLAYER CREATION ////////////////////
/* 
VIEW THAT RECEIVES THE NONCE SIGN BY THE NAMI WALLET FROM THE CLIENT  
RETURNS A JWT WEB TOKEN WITH THE NEWLY CREATED PLAYER ADDRESS IN IT

********* CHANGE EXPIRACY DATE TO ONE WEEK
*/

const verifySignature = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    // VALIDATES BODY AND PARAMETER
    const { signature, key } = request.body
    const { nonce } = request.params

    try {
        if(typeof signature !== "string" || typeof nonce !== "string") throw new ApiError(400, "invalid_data", "Invalid signature or nonce")
        const tokens = await handleSignVerification(identityService, {
            ctype: "sig",
            deviceType: "Browser",
            publicKey: key,
            signedNonce: signature,
            nonce: nonce,
        }, logger)
        response.cookie('access', tokens.access, { maxAge: COOKIE_EXPIRACY, sameSite: 'none', secure: true});
        return response.status(201).json({
                    message: "Player created",
                    code: "player_created",
                    refresh: tokens.refresh
                })
    } catch (error: any) {
        console.log(error);        
        next(error)
    }
}

const refreshToken = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const [refreshToken] = request.body

    try {
        const newTokens = await handleRefreshToken(identityService, refreshToken, logger)
        response.cookie('access', newTokens.access, { maxAge: COOKIE_EXPIRACY, sameSite: 'none', secure: true});
        return response.status(200).json({
                    message: "Tokens refreshed",
                    code: "tokens_refreshed",
                    refresh: newTokens.refresh
                })
    } catch (error) {
        next(error)
    }
}

////////////////// LOGS USER OUT ////////////////////
/* 
REMOVES ACCESS TOKEN IN THE CLIENT
*/
const walletLogout = (request: Request, response: Response) => {
    response.cookie('access', "", { maxAge: 18000000, sameSite: 'none', secure: true});
    return response.status(200).send("Logged out");
}

////////////////// GETS DRAGON SILVER TO CLAIM ////////////////////
/* 
GETS THE DRAGON SILVER TO CLAIM FROM THE DB OF A SPECIFIC STAKE ADDRESS
*/
const getDragonSilverToClaim = (assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const userId: string  = (request as AuthRequest).auth.userId;
    logger.log.info({messagge: "get Dragon Silver To Claim: user id from the request cookie", userId})
    try {
        const policy = wellKnownPolicies.dragonSilver.policyId
        if (policy == undefined) throw new Error("Dragon silver policy is undefined")
        const amResponse = await assetManagementService.list(userId, { policies: onlyPolicies(wellKnownPolicies) }, logger)
        if (amResponse.status == "unknown-user") throw new Error("AssetManagement: Unknown User")
        const dragonSilverQuantity = amResponse.inventory[policy]?.find(asset => asset.unit == "DragonSilver")?.quantity ?? "0"
        return response.status(200).json({
            dragon_silver: parseInt(dragonSilverQuantity)
        })
    } catch (error: any) {
        console.error(error)
        next(error)
    }
}

////////////////// GENERATES THE TX TO MINT A NFT (PIXEL TILE OR GMA) ////////////////////
/* 
GENERATES THE TX DATA (CBOR) TO MINT A NFT AND SENDS IT TO THE CLIENT
THE CLIENT SIGNS THE TX AND RESEND IT TO THE SIGN AND SUBMIT TX ENDPOINT
*/
const mintTestNft = (assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const {stakeAddress, userId} = request.auth!
    const [assetName, nftType] = await getRandomNFT()
    const policyId = await getCollectionPolicy(nftType, wellKnownPolicies)

    try {
        // if(process.env.CARDANO_NETWORK == "mainnet") throw new ApiError(403, "incorrect_network", "Adventurers can only be minted in testnet")
        // const unsignedTx = await createMintNftTx(stakeAddress, assetName, nftMetadata);
        const options = {
            unit: assetName,
            policyId: policyId,
            quantity: "1"
        }
        const amResponse = await assetManagementService.grant(userId, options, logger)
        if (amResponse.status == "invalid") throw new ApiError(400, "invalid_request", `${amResponse.reason}`)
        return response.status(200).send({
            message: "Adventurer successfully granted",
            code: "successfull"
        })
    } catch (error: any) {
        next(error);
    }
}

////////////////// SIGNS AND SUBMMITS THE NFT TX ////////////////////
/* 
RECEIVES A SIGNED TX IN CBOR FORMAT 
SIGNS AGAIN THE TX WITH THE POLICY ADDR
SUBMMITS THE TX TO THE CARDANO BLOCKCHAIN
*/
const signAndSubmitTx = (assetManagementService: AssetManagementService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const {witness, tx, claimId} = request.body

    try {
        //if(process.env.CARDANO_NETWORK == "mainnet") throw new ApiError(403, "incorrect_network", "Adventurers can only be minted in testnet")
        // const mintTx: string | undefined = await signMintTx(tx, witness, process.env.POLICY_PRIVATE_KEY)

        // const claimedDs = await ClaimedDragonSilver.findOne({
        //     where: {
        //         stake_address: stakeAddress,
        //         state: "created",
        //         tx_hash: Buffer.from(tx)
        //     }
        // })
        // if (claimedDs) {         
        //     await claimedDs?.update({
        //         state: "submitted",
        //         tx_id: mintTx
        //     })
        // }
        const amResponse = await assetManagementService.submitClaimSignature(claimId, tx, witness, logger)
        if (amResponse.status == "invalid") throw new Error(amResponse.reason)

        return response.status(200).send({
            message: "Tx Submmited successfully",
            code: "tx_submmited"
        })
    } catch (error: any) { 
        next(error);
    }
}

////////////////// CHECKS THE STATUS OF A GIVEN TX ////////////////////
/* 
QUERIES BLOCKFROST API TO FIND A TX
BASED ON THE OUTCOME CHECKS IF THE TX IS PENDING, COMPLETED OR FAILED
*/
const checkTxStatus = async (request: Request, response: Response, next: NextFunction) => {
    const txHash = request.body.tx;

    try {        
        const txData = await blockfrost.txs(txHash);
        return response.status(200).send({
            message: "Transaction already in blockchain",
            code: "tx_in_blockchain"
        });
    } catch (error) {
        return response.status(404).send({
            message: "Transaction not found",
            code: "tx_not_found"
        })
    }
}

////////////////// GET DRAGON SILVER OF AN ADDRESS ////////////////////
/* 
QUERIES BLOCKFROST API TO FIND THE ASSETS OF AN ADDRESS
GETS THE DRAGON SILVER OF THE SPECIFIC ADDRESS AND SENDS IT TO THE CLIENT
*/
// const getDragonSilverV1 = async (request: Request, response: Response ) => {
//     const stakeAddress = request.auth!.stake_address;
//     let assetUnit = process.env.POLICY_ID?.split(".").join("");

//     try {
//         const assets = await blockfrost.accountsAddressesAssets(stakeAddress);
//         const asset = assets.find(asset => asset.unit === assetUnit);        
//         let dragonSilver: number = parseInt(asset?.quantity!);
        
//         if (!dragonSilver) {
//             dragonSilver = 0;
//         }
        
//         return response.status(200).send({
//             "dragon_silver": dragonSilver
//         });
//     } catch (error) {
//         return response.status(404).send("not found")
//     }
// }

////////////////// CLAIM DRAGON SILVER ////////////////////
/* 
GENERATES A TX THAT MINTS THE AMOUNT OF DRAGON SILVER TO CLAIM
SETS THE DRAGON SILVER TO CLAIM TO 0
IF THE TX FAILS RETURNS THE AMOUNT OF DS
*/
const claimDragonSilver = (assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    const userId = request.auth!.userId
    const stakeAddress = request.auth!.stake_address
    const {amount} = request.body
    try {
        //if(process.env.CARDANO_NETWORK == "mainnet") throw new ApiError(403, "incorrect_network", "Dragon Silver can only be claimed in testnet")
        // const player: IPlayer | null = await Player.findOne({
        //     attributes: ["dragon_silver"],
        //     raw: true,
        //     where: {
        //         user_id: userId
        //     }
        // })
        // if (!player) throw new ApiError(404, "player_not_found", "Player not found")
        // if (!player.dragon_silver) throw new ApiError(409, "not_enough_dragon_silver", "You do not have enough Dragon Silver") 
        
        // const tx: string = await mintDragonSilver(player?.dragon_silver!, stakeAddress);

        // const t = await sequelize.transaction();
        // await ClaimedDragonSilver.create({
        //     stake_address: stakeAddress,
        //     dragon_silver: player.dragon_silver!,
        //     tx_hash: tx,
        //     state: "created"
        // }, { transaction: t})
        // await Player.update({ 
        //     dragon_silver: 0
        // }, {
        //     where: { 
        //         user_id: userId
        //     },
        //     transaction: t
        // }) 

        // await t.commit();
        const dragonSilverPolicy = wellKnownPolicies.dragonSilver.policyId
        if (dragonSilverPolicy == undefined) throw new Error("Dragon Silver policy id not found")
        const options = {
            unit: "DragonSilver",
            policyId: dragonSilverPolicy,
            quantity: amount
        }
        const amResponse = await assetManagementService.claim(userId, stakeAddress, options, logger)
        if(amResponse.status == "invalid") throw new Error("Invalid request to asset management service")
        return response.status(200).send({
            tx: amResponse.tx,
            claimId: amResponse.claimId
        })
    } catch (error: any) {
        next(error);
    }
}

export {
    getAuthenticationNonce,
    verifySignature,
    walletLogout,
    mintTestNft,
    signAndSubmitTx,
    checkTxStatus,
    getDragonSilverToClaim,
    claimDragonSilver,
    refreshToken
};