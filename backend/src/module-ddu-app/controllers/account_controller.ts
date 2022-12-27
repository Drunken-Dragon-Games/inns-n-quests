//types imports
import { AccountDataOutput } from "../types"

//Express Imports
import { Response, NextFunction } from "express"
import { Request } from "express-jwt";
import { SECRET_KEY, COOKIE_EXPIRACY } from '../settings'

//Middleware iports
import { AuthRequest } from "../types";

//Libraryes imports
import jwt from "jsonwebtoken";
import * as s from "../../service-identity"
import { withTracing } from "../base-logger"
import { IdentityService } from "../../service-identity";

/**
 * Generates and stores nonce for wallet address
 * @param request most contain stakeadress
 * @param response 
 * @param next 
 * @returns AN AUTHENTICATION NONCE TO BE SIGNED BY THE NAMI WALLET
 */
const getAuthenticationNonce = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    logger.log.info("getting nonce");
    const { stakeAddress } = request.body
    try {
        const nonceResponse = await identityService.createSigNonce(stakeAddress, logger)
        if (nonceResponse.status == "ok") return response.status(201).json({responseCode: "nonce_generated",nonce: nonceResponse.nonce})
        else return response.status(400).json({responseCode: nonceResponse.status})
    } catch (error: any) {
        logger.log.error(error);
        next(error)
    }
}

/**
 * Generates user intance in users table based on signed nonce from wallet
 * @param request contains the signed nonce and the original nonce
 * @param response 
 * @param next 
 * @returns jwt coockie with logging access for the address of the wallet
 */
const verifySignature = (identityService: IdentityService) => async (req: Request, res: Response, next: NextFunction) => {
    const logger = withTracing(req)
    logger.log.info("verifing signature")
    try {
        const { nonce } = req.params
        const {signature, key} = req.body

        logger.log.info({ signature });
        logger.log.info({ key });
        const credentials: s.Credentials = {ctype: "sig", deviceType: "Browser", publicKey: key, nonce, signedNonce: signature }
        const authResponse: s.AuthenticationResult = await identityService.authenticate(credentials, logger)
        logger.log.info(`authResponse status is ${authResponse}`)
        if (authResponse.status == "ok"){
            const {session, refreshToken} =  authResponse.tokens
            let token = jwt.sign(session, SECRET_KEY);
            const fullRefreshToken = jwt.sign({refreshToken, sessionId: session.sessionId}, SECRET_KEY);
            res.cookie('access', token, { maxAge: COOKIE_EXPIRACY, sameSite: 'none', secure: true });
            return res.status(201).json({ responseCode: "user_created", refreshToken: fullRefreshToken })
        }else return res.status(401).json({ responseCode: authResponse.status})

    } catch (error: any) {
        logger.log.error(error)
        next(error)
    }
}
/**
 * Genera una intancia de usuario en la DB basado en usuario de Discord
 * @param req 
 * @param res 
 * @returns jwt coockie with logging access
 */
const discordRegistration = (identityService: IdentityService) => async (req: Request, res: Response, next: NextFunction) => {
    const logger = withTracing(req)
    try {    
        logger.log.info("registering user with discord")
        const { code } = req.body
        const credentials: s.Credentials = {ctype: "discord", deviceType: "Browser", authCode: code }
        const authResponse: s.AuthenticationResult = await identityService.authenticate(credentials, logger)
        logger.log.info(`auth response status is ${authResponse.status}`);
        if (authResponse.status == "ok"){
            const {session, refreshToken} =  authResponse.tokens
            let cookieToken = jwt.sign(session, SECRET_KEY);
            const fullRefreshToken = jwt.sign({refreshToken, sessionId: session.sessionId}, SECRET_KEY);
            res.cookie('access', cookieToken, { maxAge: COOKIE_EXPIRACY, sameSite: 'none', secure: true });
            return res.status(201).json({ responseCode: "user_created", refreshToken: fullRefreshToken })
        }else return res.status(401).json({ responseCode: authResponse.status})}
    catch(error){
        logger.log.error(error)
        next(error)
    };
}



//meter discord a cuenta con wallet
const addDiscord = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    try {
        logger.log.info("adding Discord")
        const id: string = (request as AuthRequest).auth.userId
        const { code } = request.body
        logger.log.info({id})
        const credentials: s.Credentials = {ctype: "discord", deviceType: "Browser", authCode: code }
        const associateResponse: s.AssociationResult = await identityService.associate(id, credentials, logger)
        const userInfo: s.ResolveUserResult = await identityService.resolveUser({ctype: "user-id", userId: id}, logger)
        logger.log.info(`associate reponse status ${associateResponse.status}`)
        logger.log.info(`User Info reponse status ${userInfo.status}`)
        if (associateResponse.status == "ok" && userInfo.status == "ok") return response.status(200).json({responseCode: "discord-associated", updatedInfo: userInfo})
        else return response.status(409).json({responseCode: `associate status: ${associateResponse.status}, userinfo status: ${userInfo.status}`})
    } catch (error: any) {
        logger.log.error(error)
        next(error)
    }
}

//meter wallet a cuenta con discord
/**
 * Adds a wallet to an existing Discord Only account
 * @param request 
 * @param response 
 * @param next 
 */
const addWallet = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    try {
        logger.log.info("adding wallet");
        const id: string = (request as AuthRequest).auth.userId
        const { nonce } = request.params
        const {key, signature} = request.body
        logger.log.info({ signature });
        logger.log.info({ key });
        logger.log.info({id})
        const credentials: s.Credentials = {ctype: "sig", deviceType: "Browser", publicKey: key, nonce, signedNonce: signature }
        const associateResponse: s.AssociationResult = await identityService.associate(id, credentials, logger)
        const userInfo: s.ResolveUserResult = await identityService.resolveUser({ctype: "user-id", userId: id}, logger)
        logger.log.info(`associate reponse status ${associateResponse.status}`)
        logger.log.info(`User Info reponse status ${userInfo.status}`)
        if (associateResponse.status == "ok" && userInfo.status == "ok") return response.status(200).json({responseCode: "wallet-associated", stakeAddresses: userInfo.info.knownStakeAddresses})
        else return response.status(409).json({responseCode: `associate status: ${associateResponse.status}, userinfo status: ${userInfo.status}`})
    } catch (error: any) {
        logger.log.error(error)
        next(error)
    }
}


//unir cuenta discord y cuenta wallet
const mergeAccounts = async (request: Request, response: Response, next: NextFunction) => {
    return response.status(503).json({
        message: "Endpoint currently unavailable",
        code: "endpoint_currently_unavailable"
    })
    //geting current loged in user
    /*    const id: string = (request as AuthRequest).auth.userId
       const UserIntance: User = await getUserfromId(id)
   
       if (UserIntance.staking_address == null) {
           return response.status(409).json({
               message: "Please Log in with your Stake address for the merge",
               code: "invalid_user_type"
           })
       }
   
       //getting Discord Info from Code
       const { code } = request.body
       const { discordBearerToken } = await getDiscordBearerToken(code)
       let userInfo: any = await getPlayerInfoFromToken(discordBearerToken)
   
       const DiscordName = `${userInfo.username}#${userInfo.discriminator}`
       const taken: User | null = await User.findOne({ where: { 'discordUserName': DiscordName } });
   
       if (!taken) {
           return response.status(101).json({
               message: "Discord Name is available",
               code: "discord_name_available"
           })
       }
   
       UserIntance.email = taken.email
       UserIntance.discordUserName = taken.discordUserName
       UserIntance.dragon_silver = UserIntance.dragon_silver + taken.dragon_silver
       try {
           await UserIntance.save()
           await taken.destroy()
           return response.status(200).json({
               message: "Updated Database",
               code: "updated_database"
           })
       } catch {
           return response.status(500).json({
               message: "Unexpected Database Error",
               code: "unexpected_database_error"
           })
       }
    */
}

export const getAccountData = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    try {
        const id: string = (request as AuthRequest).auth.userId
        const userInfo: s.ResolveUserResult = await identityService.resolveUser({ctype: "user-id", userId: id}, logger)
        if (userInfo.status == "ok"){
            const [nickname, nameIdentifier] = userInfo.info.nickname.split("#")
            //logger.log.info({nickname}, {nameIdentifier});
            const data: AccountDataOutput = {
                stakeAddresses: userInfo.info.knownStakeAddresses,
                nickName: nickname,
                nameIdentifier: nameIdentifier,
                imgLink: "",
                discordUserName: userInfo.info.knownDiscord,
            }
            return response.status(200).json(data)
        }else return response.status(400).json({responseCode:userInfo.status })
    } catch (error: any) {
        logger.log.error(error)
        next(error)
    }
}

export const refreshSession = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    const logger = withTracing(request)
    try {
        const {fullRefreshToken} = request.body
        console.log({fullRefreshToken});
        console.log("getting the payload");
        let refreshPayload: string | jwt.JwtPayload
        try {
            refreshPayload = jwt.verify(fullRefreshToken,SECRET_KEY)
        }catch{
            response.cookie('access', "", { maxAge: 1, sameSite: 'none', secure: true });
            return response.status(401).json({ responseCode: "invalid Refresh Token"})
        }
        
        console.log(`got ${refreshPayload} as payload`);
        if (typeof refreshPayload == 'string') {
            response.cookie('access', "", { maxAge: 1, sameSite: 'none', secure: true });
            return response.status(401).json({ responseCode: "invalid Refresh Token"})
        }
        const {sessionId, refreshToken} = refreshPayload
        const RefreshResponse: s.RefreshResult = await identityService.refresh(sessionId, refreshToken, logger)
        if (RefreshResponse.status == "ok"){
            const {session, refreshToken} =  RefreshResponse.tokens
            let token = jwt.sign(session, SECRET_KEY);
            const fullRefreshToken = jwt.sign({refreshToken, sessionId: session.sessionId}, SECRET_KEY);
            response.cookie('access', token, { maxAge: COOKIE_EXPIRACY, sameSite: 'none', secure: true });
            return response.status(200).json({ responseCode: "session_refreshed", refreshToken: fullRefreshToken })
        }else {
            response.cookie('access', "", { maxAge: 1, sameSite: 'none', secure: true });
            return response.status(401).json({ responseCode: RefreshResponse.status})
        }
    } catch (error){
        logger.log.error({message: "Refresh Session error", error})
        next(error)
    }
}


export {
    discordRegistration,
    getAuthenticationNonce,
    verifySignature,
    addWallet,
    addDiscord,
    mergeAccounts
}