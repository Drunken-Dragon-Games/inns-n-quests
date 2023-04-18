import { useRouter } from "next/router"
import { useState } from "react"
import { Provider } from "react-redux"
import styled from "styled-components"
import { colors, OswaldFontFamily } from "../../common"
import { accountStore } from "../account-state"
import { AccountTransitions } from "../account-transitions"

const Background = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${colors.dduBackground};
    display: flex;
    align-items: center;
    justify-content: center;
`

const Title = styled.h1`
    color: ${colors.textBeige};
    ${OswaldFontFamily}
    font-size: 24px;
    margin-bottom: 10px;
`

const DevelopmnentSigninContainer = styled.div`
    padding: 20px;
    background-color: rgba(255,255,255,0.1);
    border-radius: 10px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
`

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 20px;
`

const DevelopmnentSigninContent = () => {
    const router = useRouter()
    if (process.env.NODE_ENV !== "development") router.push("/")
    const [nickname, setNickname] = useState("Test User")
    return (
        <Background>
            <DevelopmnentSigninContainer>
                <Title>Development Signin</Title>
                <InputWrapper>
                    <input type="text" placeholder="Nickname" value={nickname} onChange={(event) => setNickname(event.target.value) } />
                    <button type="submit" onClick={() => AccountTransitions.signinDevelopment(nickname, router)}>Sign In</button>
                </InputWrapper>
            </DevelopmnentSigninContainer>
        </Background>
    )
}

export const DevelopmnentSignin = () => 
    <Provider store={accountStore}>
        <DevelopmnentSigninContent />
    </Provider>
