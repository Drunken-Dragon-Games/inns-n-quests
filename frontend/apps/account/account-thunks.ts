import { NextRouter } from "next/router"
import { discord_redirect_uri } from "../../setting"
import { AccountBackend } from "./account-backend"
import { accountState, AccountThunk } from "./account-state"

const actions = accountState.actions

export const AccountThunks = {

    authenticateDiscord: (code: string, router: NextRouter): AccountThunk => async (dispatch) => {
        const response = await AccountBackend.authenticateDiscord(code)
        console.log(response)
        if (response.status == "ok") {
            localStorage.setItem("refresh", response.tokens.refreshToken)
            dispatch(actions.setUserInfo({
                userId: response.info.userId,
                sessionId: response.tokens.session.sessionId,
                nickname: response.info.nickname,
                stakeAddresses: response.info.knownStakeAddresses,
                profileUri: response.info.imageLink,
                email: response.info.knownEmail,
                dragonSilver: response.inventory.dragonSilver,
                dragonSilverToClaim: response.inventory.dragonSilverToClaim,
            }))
            setTimeout(() => router.push(discord_redirect_uri), 100)
        }
    },
}