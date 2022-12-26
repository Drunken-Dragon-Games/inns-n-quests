import styled from "styled-components"
import { AccountSettingData, LinkedAccount } from "./components/complex"
import { useGetDataAccount, useGetRedirectLogin } from "./hooks"
import { ConditionalRender } from "../../utils/components/basic_components"
import { Loading } from "../../utils/components/basic_components"


const AccountSettingAppComponent = styled.section`
    width: 100vw;
    background-color: #0B1015;
    height: 88vh;
    display: flex;

    @media only screen and (max-width: 414px) {
        height: 84vh;
        padding-top: 16vh;
    }

`

const AccountSettingsWrapper = styled.div`
    display: flex;
    border: 0.104vw solid #4A5362;
    width: 75vw;
    height: 30vw;
    max-width: 1920px;
    max-height: 768px;
    margin: auto auto;
    position: relative;

    @media only screen and (max-width: 414px) {
        display: block;
        width: 90vw;
        height: 150vw;
    }
`
const AccountSettingDataWrapper = styled.div`
    width: 50%;

    @media only screen and (max-width: 414px) {
        width: 100%;
    }
`

const AccountSettingLinkedAccountWrapper = styled.div`
    width: 50%;
    height: inherit;
    max-height: inherit;

    @media only screen and (max-width: 414px) {
        width: 100%;
        height: 50vw;;
    }
`

const LineMiddleOrnament = styled.div`
    border-right: 0.078vw solid #14212C;
    margin: auto 0vw;
    height: 28vw;
    max-height: 716.8px;
    

    @media only screen and (max-width: 414px) {
        border-bottom: 0.5vw solid #14212C;
        border-right: 0vw solid #14212C;
        width: 80%;
        margin: 0vw auto;
        height: 0vw;
    }
`

const CornerOrnament = styled.div`
    border: 0.104vw solid #4A5362;
    position: absolute;
    right: -0.1vw;
    top: -0.1vw;
    width: inherit;
    height: inherit;
    max-width: inherit;
    max-height: inherit;
    border-radius: 0vw 8vw 0vw 0vw;
`

const AccountSettingPage = () : JSX.Element => {
    
    const isAccountData = useGetDataAccount()

    useGetRedirectLogin(isAccountData)
    
    return (<>
       

                <AccountSettingAppComponent>
                
                    <ConditionalRender condition = {isAccountData == "fulfilled"}>
                   
                        <AccountSettingsWrapper>
                            <CornerOrnament/>
                            <AccountSettingDataWrapper>
                                <AccountSettingData/>
                            </AccountSettingDataWrapper>

                            <LineMiddleOrnament/>

                            <AccountSettingLinkedAccountWrapper>
                                <LinkedAccount/>
                            </AccountSettingLinkedAccountWrapper>

                        </AccountSettingsWrapper>
                    </ConditionalRender>
          
                    <ConditionalRender condition = {isAccountData == "pending"}>   
           
                        <Loading size={8}/>
                    </ConditionalRender>
                    

                </AccountSettingAppComponent>

       

      
        
    </>)
}

export default AccountSettingPage