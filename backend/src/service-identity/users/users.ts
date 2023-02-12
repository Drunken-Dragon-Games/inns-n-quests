import { User, UserStakeAdress } from "./users-db";
import { generateIdentenfier, generateRandomNickname } from "./utils";
import { DiscordTokens, getUserInfoFromBearerToken } from "../discord/code-verification"
import { UserInfo, UserFullInfo } from "../models";
import { Attempt, succeeded, failed, Unit, unit } from "../../tools-utils";

export class Users {

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

    static registerWithDiscordTokens = async (discordTokens: DiscordTokens): Promise<Attempt<string>> => {
        const discordUserInfo = await getUserInfoFromBearerToken(discordTokens.discordBearerToken)
        if (discordUserInfo.ctype == "failure") return failed
        const existingUser = await User.findOne({ where: { discordUserName: discordUserInfo.result.discordName, email: discordUserInfo.result.email } });
        if (existingUser) {
            existingUser.discordRefreshToken = discordTokens.refreshtoken
            await existingUser.save()
            return succeeded(existingUser.userId)
        }
        else {
            const nickname = await generateRandomNickname()
            const nameIdentifier = await generateIdentenfier(nickname)
            const discordUserName = discordUserInfo.result.discordName
            const email = discordUserInfo.result.email
            const discordRefreshToken = discordTokens.refreshtoken
            const user = await User.create({ discordUserName, email, nickname, nameIdentifier, discordRefreshToken })
            return succeeded(user.userId)
        }
    }

    static associateWithDiscord = async (userId: string, discordTokens: DiscordTokens): Promise<Attempt<"ok" | "discord-used">> => {
        const existingUser = await User.findOne({ where: { userId } });
        if (existingUser) {
            const discordUserInfo = await getUserInfoFromBearerToken(discordTokens.discordBearerToken)
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
            const [nickname, nameIdentifier] = info.nickname.split("#")
            user = await User.findOne({ where: { nickname, nameIdentifier } })
        }
        if (user == null) return failed
        else {
            const addresses = await UserStakeAdress.findAll({ where: { userId: user.userId }, attributes: ["stakeAddress"] })
            return succeeded({
                userId: user.userId,
                nickname: user.nickname + "#" + user.nameIdentifier,
                knownDiscord: user.discordUserName,
                knownStakeAddresses: addresses.map(a => a.stakeAddress)
            })
        }
    }

    static resolveUsersNoStakeAddresses = async (userIds: string[]): Promise<UserInfo[]> => {
        const users = await User.findAll({ where: { userId: userIds } })
        const usersInfo: UserInfo[] = users.map(user => ({
            userId: user.userId,
            nickname: user.nickname + "#" + user.nameIdentifier,
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
                nickname: user.nickname + "#" + user.nameIdentifier,
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
}