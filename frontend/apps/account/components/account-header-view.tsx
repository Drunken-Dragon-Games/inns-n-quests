import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { Provider } from "react-redux"
import styled from "styled-components"
import { colors, DDButton, OswaldFontFamily, SimpleDDButton } from "../../common"
import { AccountState, accountStore } from "../account-state"
import { AccountTransitions } from "../account-transitions"

const AccountHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: white;
    font-size: 14px;
    font-weight: bold;

    @media only screen and (max-width: 414px) {
    }
`

const Nickname = styled.div`
    ${OswaldFontFamily}
    color: ${colors.textGray};
    font-size: 16px;
`

const AccountHeaderContent = () => {
    const router = useRouter()
    const userInfo = useSelector((state: AccountState) => state.userInfo)
    const isDiscordFinish = AccountTransitions.useDiscordFinish(router)
    AccountTransitions.useRefreshSession()
    return (
        <AccountHeaderContainer>
            { userInfo ? <>
                <Nickname>{userInfo.nickname}</Nickname> 
                <SimpleDDButton onClick={() => AccountTransitions.signout(router)}>Sign Out</SimpleDDButton>
            </>: isDiscordFinish ?
                <div>Loading...</div>
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
