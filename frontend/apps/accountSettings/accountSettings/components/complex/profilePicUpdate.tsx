import styled from "styled-components"
import { InteractButton } from "../../../../utils/components/basic_components"
import Image from "next/image"

const ProfilePicComponent = styled.div`
    display: Flex;
    position: relative;
    width: 100%;
    height: 20vw;
    max-height: 512px;

    @media only screen and (max-width: 414px) {
        height: 30vw;
    }
`

const ProfilePicMark = styled.div`
    border: 0.156vw solid #CA9F44;
    width: 16vw;
    height: 16vw;
    max-width: 409.36px;
    max-height: 409.6px;
    border-radius: 10vw;
    overflow: hidden;

    @media only screen and (max-width: 414px) {
        width: 30vw;
        height: 30vw;
        border-radius: 30vw;
        border: 0.5vw solid #CA9F44;
    }
`

const ProfilePicMarkPosition = styled.div`
    margin: auto;
`

const ButtonWrapper = styled.div`
    position: absolute;
    top: 17vw;
    left: 25vw;

    @media only screen and (max-width: 414px) {
        top: 25vw;
        left: 60vw;
    }

    @media only screen and (min-width: 2560px) {
        top: 425px;
        left: 650px;
    }
`


const ProfilePicUpdate = (): JSX.Element => {

    return (<>
    <ProfilePicComponent>

        <ProfilePicMarkPosition>
            <ProfilePicMark>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/mockData/Slime_pf.png" alt = " profile picture" width ={50} height = {50} layout="responsive"/>
            </ProfilePicMark>
        </ProfilePicMarkPosition>
        

        <ButtonWrapper>
            <InteractButton action ={() => null} big_size={true} disable={true}/>
        </ButtonWrapper>
        
    </ProfilePicComponent>
        
    
    </>)
}

export default ProfilePicUpdate