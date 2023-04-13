//Express Imports
import { Response, NextFunction } from "express"
import { Request } from "express-jwt";

//Middleware iports
import { AuthRequest } from "../types";

//Libraryes imports
import * as s from "../../service-identity"

import * as assets from "../../service-asset-management"

import { withTracing } from "../base-logger";

import { IdentityService } from "../../service-identity";
import { AssetManagementService } from "../../service-asset-management";
import { onlyPolicies, WellKnownPolicies } from "../../registry-policies";

/**
 * @param req debe contener coockie de auth
 * @param res
 * @returns un json con la informacion de un usuario basado en coockie
 */
const getInfo = (identityService: IdentityService, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => async (request: Request, res: Response, next: NextFunction) => {
    const logger = withTracing(request)
    try {
        const sessionId = (request as AuthRequest).auth.sessionId
        const UserInfo = await identityService.resolveSession(sessionId, logger)
        if (UserInfo.status == "ok"){
            const userId = UserInfo.info.userId
            const dsPolicyId = wellKnownPolicies.dragonSilver.policyId
            const assetList: assets.ListResponse = await assetManagementService.list(userId, { policies: onlyPolicies(wellKnownPolicies) }, logger)
            if (assetList.status == "ok"){
                const inventory: assets.Inventory = assetList.inventory
                //console.log({dsPolicyId});
                const DSamount = inventory[dsPolicyId!]?.find(i => i.chain === true)?.quantity ?? "0"
                //console.log({DSamount})
                const DSTC = inventory[dsPolicyId!]?.find(i => i.chain === false)?.quantity ?? "0"
                const nftAmount = 0 // We wont use this anymore (the whole endpoint)
                return res.status(201).json({
                    amountNFT: nftAmount,
                    nickName: UserInfo.info.nickname,
                    imgLink: UserInfo.info.imageLink,
                    DSTC,
                    DS: DSamount
                })
            }else return res.status(400).json({responseCode: "could not get assets", UserInfo})
        
        }else return res.status(401).json({ responseCode: "canot get user info", UserInfo: UserInfo.status})
    } catch (error: any) {
        console.log(error);
        next(error)
    }
}

const getDragonSilver = (assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => async (request: Request, response: Response) => {
    const dsPolicyId = wellKnownPolicies.dragonSilver.policyId
    const logger = withTracing(request)
    const id: string = (request as AuthRequest).auth.userId
    const assetList: assets.ListResponse = await assetManagementService.list(id, { policies: [ dsPolicyId ] }, logger)
    if (assetList.status == "ok"){
        const inventory: assets.Inventory = assetList.inventory
        const DS = inventory[dsPolicyId!].find(i => i.chain === true)?.quantity ?? "0"
        const DSTC = inventory[dsPolicyId!].find(i => i.chain === false)?.quantity ?? "0"
        return response.status(200).json({responseCode: "ok", DS, DSTC})
    }
}

export const claimDragonSilver = (assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => async (request: Request, response: Response) => {
    const dsPolicyId = wellKnownPolicies.dragonSilver.policyId
    const logger = withTracing(request)
    const id: string = (request as AuthRequest).auth.userId
    const stakeAddress = request.auth!.stake_address
    //For now we just claim ALL OF IT
    //const { amount } = request.body
    const assetList: assets.ListResponse = await assetManagementService.list(id, { policies: [ dsPolicyId ] }, logger)
    if (assetList.status == "ok"){
        const inventory: assets.Inventory = assetList.inventory
        const dragonSilverToClaim = inventory[dsPolicyId!].find(i => i.chain === false)?.quantity ?? "0"
        const options = {
            unit: "DragonSilver",
            policyId: dsPolicyId,
            quantity: dragonSilverToClaim
        }
        const claimResponse = await assetManagementService.claim(id, stakeAddress, options, logger)
        if (claimResponse.status == "ok") return response.status(200).json({ ...claimResponse, remainingAmount: 0 })
        else  return response.status(409).json({ ...claimResponse, remainingAmount: parseInt(dragonSilverToClaim) })
    }
}

const getAvailableProfilePicks = async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    //TODO: get from asset manager
    /*     //const { address } = request.body
        const id: string = (request as AuthRequest).auth.userId
        const UserIntance: User | null = await User.findOne({ where: { 'id': id } });
        if (!UserIntance) {
            return response.status(400).json({
                message: "Invalid cookie",
                code: "Invalid cookie"
            })
        }
        const address = UserIntance.staking_address
        console.log(address);
        let domain = ""
        if (MODE === "DEV") {
            domain = "http://127.0.0.1:13371"
        } else if (MODE === "PROD") {
            domain = "http://inn-keeper.drunkendragon.games:13371"
        }
        let path = "/v2/inventory/"
        let url = `${domain}${path}${address}`
        let r
        try {
            r = await axios.get(url)
        } catch {
            return response.status(400).json({
                message: "Invalid address",
                code: "Invalid address"
            })
        }
        console.log(r.data.pixeltiles);
        let pixelTiles: IApiNft[] = r.data.pixeltiles
        let gmas: IApiNft[] = r.data.gmas
        let avatars: IAvatar[] = []
        pixelTiles.forEach((tile: IApiNft) => {
            const pixelObject = {
                name: tile.name,
                imageLink: `https://ipfs.io/${pixelTileMetaData[tile.name].image}`,
                type: "PixelTile",
                sprite: `/pixeltiles/x${SPRITE_SCALE}/pixel_tile_${tile.name.slice(9, tile.name.length)}.png`
            }
            avatars.push(pixelObject)
        })
    
        gmas.forEach((tile: IApiNft) => {
            const gmaObject = {
                name: tile.name,
                imageLink: `https://ipfs.io/${gmasMetadata[tile.name].image}`,
                type: "GMA",
                sprite: `/gmas/x${SPRITE_SCALE}/${tile.name}.png`
            }
            avatars.push(gmaObject)
        })
        console.log(avatars);
    
        return response.status(200).json(avatars)
     */
}

/**
 * Logs User out
 * @param request 
 * @param response 
 * @returns cookieless response
 */
const logout = (identityService: IdentityService) => async (request: Request, response: Response) => {
    const logger = withTracing(request)
    const signOut: s.SignOutResult = await identityService.signout((request as AuthRequest).auth.sessionId, logger)
    response.cookie('access', "", { maxAge: 0, sameSite: 'none', secure: true });
    if (signOut.status == "ok") return response.status(200).json({ responseCode:"Logged out"})
    else return response.status(400).json({ responseCode:signOut.status})
}

export const setProfilePick = async (request: Request, response: Response, next: NextFunction) => {
    //TODO add update profile pick upton to identity manager
    /* const { imgLink } = request.body
    const updatedRepsonse: s.UpdateUserResponse = identityClient.updateUser()
    const id: string = (request as AuthRequest).auth.userId
    try {
        const UserIntance: User = await getUserfromId(id)
        UserIntance.imgLink = imgLink
        await UserIntance.save()
        return response.status(200).json({
            message: "Profile pick uptaded",
            code: "profile_pick_uptaded"
        })
    } catch (error) {
        next(error)
    } */
}

export const setNickName = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    try {
        console.log("setting nickname");
        const { nickname } = request.body
        const id: string = (request as AuthRequest).auth.userId
        console.log({id})
        console.log({nickname})
        const updateUserReponse: s.UpdateUserResult = await identityService.updateUser(id, {nickname}, logger)
        console.log(`updateUserReponse status is ${updateUserReponse.status}`);
        const UserInfo = await identityService.resolveUser({ctype: "user-id", userId: id}, logger)
        console.log(`resolveUser status is ${UserInfo.status}`);
        if (updateUserReponse.status == "ok" && UserInfo.status == "ok") {
            const [nickName, identifier] = UserInfo.info.nickname.split("#")
            return response.status(200).json({responseCode: "nickname Updated", nickName, identifier})}
        else return response.status(409).json({responseCode: `updateUserReponse status is ${updateUserReponse.status}, userInfo response is ${UserInfo.status}`})
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export {
    getInfo,
    logout,
    getDragonSilver,
    getAvailableProfilePicks
}