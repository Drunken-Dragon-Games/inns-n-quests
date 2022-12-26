import styled from "styled-components"
import { TextOswald, InteractButton, LinkDisable } from "../../components/basic_components"
import Image from "next/image"
import { useRedirect } from "../../hooks"



const ProfileInformationWrapper = styled.div`
    display: inline-block; 
    display: flex;
    min-width: 11vw;
    
    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const ProfilePic = styled.div`
    border: 0.105vw solid #CA9F44;
    border-radius: 3vw;
    width: 3vw;
    height: 3vw;
    max-width: 76.8px;
    max-height: 76.8px;
    overflow: hidden;

    @media only screen and (max-width: 414px) {
        border: 0.5vw solid #CA9F44;
        border-radius: 6vw;
        width: 10vw;
        height: 10vw;
    }
`

const SecondSection = styled.div`
    padding: 0vw 0.5vw;
  
`
const ProfileNameWrapper = styled.div`
    margin-bottom: 0.4vw;
    height: 1.2vw;
`

const ProfileInformationWrapperMobile = styled.div`
    display: none;
    @media only screen and (max-width: 414px) {
        display: block;

    }
`

interface ProfileInformation{
    nick_name: string
    profile_picture_url: string
}

const ProfileInformation = ({nick_name, profile_picture_url } : ProfileInformation ) =>{

    const [ redirectPath, redirectUrl] = useRedirect()
    
    return (<>
        <ProfileInformationWrapper>

            <ProfilePic>
                <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/mockData/Slime_pf.png" layout="responsive" width={100} height={100} alt = "profile picture"/>
            </ProfilePic>
            <SecondSection>
                <ProfileNameWrapper>
                    <TextOswald fontsize={1} color="#4A5362">{nick_name}</TextOswald>
                </ProfileNameWrapper>
                <InteractButton action={() => redirectPath("/accountsettings")}/>
            </SecondSection>

        </ProfileInformationWrapper>

        <ProfileInformationWrapperMobile>
            <LinkDisable url="/accountsettings">
                <ProfilePic>
                    <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/mockData/Slime_pf.png" layout="responsive" width={100} height={100} alt = "profile picture"/>
                </ProfilePic>
            </LinkDisable>
        </ProfileInformationWrapperMobile>
    </>)
}

export default ProfileInformation