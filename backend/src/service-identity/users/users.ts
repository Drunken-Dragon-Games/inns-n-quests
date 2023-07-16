import { User, UserStakeAdress } from "./users-db";
import { generateIdentenfier, generateRandomNickname } from "./utils";
import { DiscordConfig, DiscordTokens, checkValidDiscordRefresh, genDiscordTokens, getUserInfoFromBearerToken } from "../discord/code-verification"
import { UserInfo, UserFullInfo, DeassociationResult } from "../models";
import { Attempt, succeeded, failed, Unit, unit } from "../../tools-utils";
import { LoggingContext } from "../../tools-tracing";
import { Op } from "sequelize";

export class Users {

    static registerSimpleUser = async (nickname: string): Promise<string> => {
        const existingUser = await User.findOne({ where: { nickname } })
        if (existingUser) return existingUser.userId
        const nameIdentifier = await generateIdentenfier(nickname)
        const user = await User.create({ nickname, nameIdentifier })
        return user.userId
    }

    static registerWithStakingAddress = async (stakeAddress: string): Promise<string> => {
        const existingRegistration = await UserStakeAdress.findOne({ where: { stakeAddress } });
        if (existingRegistration) return existingRegistration.userId
        else {
            const nickname = await generateRandomNickname()
            const nameIdentifier = await generateIdentenfier(nickname)
            const user = await User.create({ nickname, nameIdentifier })
            const registration = await UserStakeAdress.create({ stakeAddress, userId: user.userId })
            return registration.userId
        }
    }

    static associateWithStakingAddress = async (userId: string, stakeAddress: string): Promise<Attempt<"ok" | "stake-address-used">> => {
        const existingUser = await User.findOne({ where: { userId } });
        if (existingUser) {
            //porfavor no me peges fran yo se que esta feo pero funciona
            if (await UserStakeAdress.count( {where: { stakeAddress }}) > 0) return succeeded("stake-address-used")
            await UserStakeAdress.create({ stakeAddress, userId: existingUser.userId })
            return succeeded("ok")
        } else return failed
    }

    static deassociateStakingAddress = async (userId: string, stakeAddress: string): Promise<DeassociationResult> => {
        const addressInstance = await UserStakeAdress.findOne({where: {stakeAddress}})
        if (!addressInstance) return {ctype: "failure", error: "Stake Address not registered."}
        if (addressInstance.userId !== userId) return {ctype: "failure", error: "Stake Address does not belong to user."}
        await addressInstance.destroy()
        return {ctype: "success"}
    }

    static registerWithDiscordTokens = async (discordTokens: DiscordTokens, logger?: LoggingContext): Promise<Attempt<string>> => {
        const discordUserInfo = await getUserInfoFromBearerToken(discordTokens.discordBearerToken, logger)
        if (discordUserInfo.ctype == "failure") return failed
        const existingUser = 
            (await User.findOne({ where: { discordUserId: discordUserInfo.result.discordUserId } })) ??
            (await User.findOne({ where: { email: discordUserInfo.result.email } }))
        if (existingUser) {
            /** If there is a current user, we run some fixes on how we save the user's discord information if needed. */
            if(!existingUser.discordUserId) { existingUser.discordUserId = discordUserInfo.result.discordUserId }
            /** The discord global name is Discord's display name. */
            const discordGlobalName = discordUserInfo.result.discordGlobalName
            /** The discord name is the unique Discord's name identifier, if it's using the new discord username system it's saved as username#0 with 0 being the descriminator number. */
            const discordName = discordUserInfo.result.discordName
            /** If any of the obove values changed, we save the new ones. */
            if (discordGlobalName && discordGlobalName !== existingUser.nickname) 
                existingUser.nickname = discordGlobalName
            if (discordName !== existingUser.discordUserName) 
                existingUser.discordUserName = discordName
            /** Save new refresh tokens for later use. */
            existingUser.discordRefreshToken = discordTokens.refreshtoken
            await existingUser.save()
            return succeeded(existingUser.userId)
        }
        else {
            const discordUserId = discordUserInfo.result.discordUserId
            const nickname = discordUserInfo.result.discordGlobalName ?? discordUserInfo.result.discordName
            const nameIdentifier = await generateIdentenfier(nickname)
            const discordUserName = discordUserInfo.result.discordName
            const email = discordUserInfo.result.email
            const discordRefreshToken = discordTokens.refreshtoken
            const user = await User.create({ discordUserId, discordUserName, email, nickname, nameIdentifier, discordRefreshToken })
            return succeeded(user.userId)
        }
    }

    static saveDiscordUserIdIfNotExists = async (userId: string, bearerToken: string, logger?: LoggingContext): Promise<void> => {
        try{
            const existingUser = await User.findOne({ where: { userId } });
            if (existingUser) {
                if(!existingUser.discordUserId) {
                    const discordUserInfo = await getUserInfoFromBearerToken(bearerToken, logger)
                    if (discordUserInfo.ctype == "failure") {
                        logger?.log.error(`When trying yo save discord user Id could not get info with the bearer Token`)
                        return
                    }
                    existingUser.discordUserId = discordUserInfo.result.discordUserId
                    await existingUser.save()
                }
                return
            } 
            else return
        }
        catch(e: any){
            logger?.log.error(`When trying yo save discord user Id catched error: ${e.message ?? e}`)
        }
    }

    static associateWithDiscord = async (userId: string, discordTokens: DiscordTokens, logger?: LoggingContext): Promise<Attempt<"ok" | "discord-used">> => {
        const existingUser = await User.findOne({ where: { userId } });
        if (existingUser) {
            const discordUserInfo = await getUserInfoFromBearerToken(discordTokens.discordBearerToken, logger)
            if (discordUserInfo.ctype == "failure") return failed
            //porfavor no me peges fran yo se que esta feo pero funciona
            if (await User.count( {where: { discordUserName: discordUserInfo.result.discordName }}) > 0) return succeeded("discord-used")
            existingUser.discordUserName = discordUserInfo.result.discordName
            existingUser.email = discordUserInfo.result.email
            existingUser.discordRefreshToken = discordTokens.refreshtoken
            await existingUser.save()
            return succeeded("ok")
        } else return failed
    }


    static resolve = async (info: { ctype: "user-id", userId: string } | { ctype: "nickname", nickname: string }): Promise<Attempt<UserInfo>> => {
        let user: User | null
        if (info.ctype == "user-id") {
            const userId = info.userId
            user = await User.findOne({ where: { userId } })
        } else {
            /* const [nickname, nameIdentifier] = info.nickname.split("#")
            if (!nameIdentifier) 
                user = await User.findOne({ where: { nickname } })
            else
                user = await User.findOne({ where: { nickname, nameIdentifier } }) */
                user = await User.findOne({where: {nickname: info.nickname}})
        }
        if (user == null) return failed
        else {
            const addresses = await UserStakeAdress.findAll({ where: { userId: user.userId }, attributes: ["stakeAddress"] })
            return succeeded({
                userId: user.userId,
                nickname: user.nickname,
                knownDiscord: user.discordUserName,
                knownStakeAddresses: addresses.map(a => a.stakeAddress)
            })
        }
    }

    static resolveUsersNoStakeAddresses = async (userIds: string[]): Promise<UserInfo[]> => {
        const users = await User.findAll({ where: { userId: userIds } })
        const usersInfo: UserInfo[] = users.map(user => ({
            userId: user.userId,
            nickname: user.nickname,
            knownDiscord: user.discordUserName,
            knownStakeAddresses: []
        }))
        return usersInfo
    }

    static getinfo = async (userId: string): Promise<Attempt<UserFullInfo>> => {
        const user = await User.findOne({ where: { userId } })
        if (user == null) return failed
        else {
            const addresses = await UserStakeAdress.findAll({ where: { userId: user.userId }, attributes: ["stakeAddress"] })
            return succeeded({
                userId: user.userId,
                nickname: user.nickname,
                knownDiscord: user.discordUserName,
                knownStakeAddresses: addresses.map(a => a.stakeAddress),
                imageLink: user.imageLink,
                knownEmail: user.email
            })
        }
    }


    static update = async (userId: string, info: { nickname: string }): Promise<Attempt<Unit>> => {
        const nameIdentifier = await generateIdentenfier(info.nickname)
        const affected = await User.update({ nickname: info.nickname, nameIdentifier }, { where: { userId } })
        if (affected[0] == 1) return succeeded(unit)
        else return failed
    }

    static total = async () => {
        return await User.count()
    }

    static migrationFixDiscordUsernameInDB = async (discordConfig: DiscordConfig) => {
        
        const fixForUser = async (user: User): Promise<number> => {
            const newTokens = await checkValidDiscordRefresh(user.discordRefreshToken, discordConfig)
            if (newTokens.ctype == "failure") {
                console.error(`Could not refresh tokens for user ${user.userId}!!!`)
                return 0
            }
            const discordUserInfo = await getUserInfoFromBearerToken(genDiscordTokens(newTokens.result).discordBearerToken)
            if (discordUserInfo.ctype == "failure") {
                console.error(`Could not get info for user ${user.userId}!!!`)
                return 0
            }
            user.discordUserName = discordUserInfo.result.discordName
            user.discordRefreshToken = newTokens.result.refresh_token
            await user.save()
            console.log(`Discord username fixed for user: ${user.dataValues}`)
            return 1
        }

        const iterate = async (count: number) => {
            const users = await User.findAll({ where: { discordUserName: { [Op.notLike]: "%#%" } }, attributes: ["userId", "discordRefreshToken"], limit: 100 })
            if (users.length == 0) return count
            const fixed = users.map(fixForUser)
            const fixedCount = (await Promise.all(fixed)).reduce((a, b) => a + b, 0)
            await iterate(count + fixedCount)
        }

        const fixed = await iterate(0)
        console.log(`Fixed ${fixed} discord usernames`)
    }
}