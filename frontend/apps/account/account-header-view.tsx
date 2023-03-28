import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { Provider } from "react-redux"
import styled from "styled-components"
import { DDButton } from "../common"
import { AccountState, accountStore } from "./account-state"
import { AccountTransitions } from "./account-transitions"

const AccountHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 414px) {
    }
`

export const AccountHeaderContent = () => {
    const router = useRouter()
    const userInfo = useSelector((state: AccountState) => state.userInfo)
    const isDiscordFinish = AccountTransitions.useDiscordFinish(router)
    return (
        <AccountHeaderContainer>
            { userInfo ? 
                <div>{userInfo.nickname}</div> 
            : isDiscordFinish ?
                <div>loading...</div>
            :
                <DDButton onClick={() => AccountTransitions.startDiscordAuth(router)}><b>Sign Up/In</b></DDButton> 
            }
        </AccountHeaderContainer>
    )
}

export const AccountHeader = () => 
    <Provider store={accountStore}>
        <AccountHeaderContent />
    </Provider>
