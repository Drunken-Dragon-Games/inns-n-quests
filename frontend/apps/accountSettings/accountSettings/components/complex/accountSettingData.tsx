import { ProfilePicUpdate, DataUpdate } from "./"
import styled from "styled-components"
import { TitleOswald } from "../../../../utils/components/basic_components"
import { useGeneralSelector } from "../../../../../features/hooks" 
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { LogoutButton } from "../basic_components"


const AccountSettingDataComponent = styled.div`
    width: 100%;
    background-color: #0B1015;
    padding: 1vw 0vw 2.083vw 0vw;

    @media only screen and (max-width: 414px) {
        padding: 8vw 0vw 8vw 0vw;
    }
`

const TitleWrapper = styled.div`
    margin-bottom: 2vw;

    @media only screen and (max-width: 414px) {
        margin-bottom: 9vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-bottom: 10px;
    }
`

const ProfilePicWrapper = styled.div`
    margin-bottom: vw;
`

const LogOutButtonPosition = styled.div`
    display: flex;
    margin-top: 1vw;

    @media only screen and (max-width: 414px) {
        margin-top: 4vw;
    }

    @media only screen and (min-width: 2560px) {
        margin-top: 0vw;
    }
`

const Center = styled.div`
    margin : auto;
`
const AccountSettingData  = (): JSX.Element =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const nickName = generalSelector.accountData.data.nickName
    const nameIdentifier = generalSelector.accountData.data.nameIdentifier

    return(<>
        <AccountSettingDataComponent>

            <TitleWrapper>    
                <TitleOswald fontsize={1.5} color = "#4A5362" textAlign = "center" fontsizeMobile = {6} lineHeightMobil = {7} >
                    Account Settings
                </TitleOswald>
            </TitleWrapper>
            
            <ProfilePicWrapper>
                <ProfilePicUpdate/>
            </ProfilePicWrapper>
            
            
            <DataUpdate name={nickName} nameIdentifier = {nameIdentifier}/>
            
            <LogOutButtonPosition>
                <Center>
                    <LogoutButton/>
                </Center>
            </LogOutButtonPosition>
          
        </AccountSettingDataComponent>
       
    </>)
}

export default AccountSettingData