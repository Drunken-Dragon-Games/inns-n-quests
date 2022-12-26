import Image from "next/image"
import styled from "styled-components"
import { SimpleButton, LinkDisable } from "../../../../utils/components/basic_components" 


const BannerCardComponent = styled.div`
    width: inherit;
    height: inherit;
    position: relative;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const BannerButton = styled.div`
    position: absolute;
    top: 20vw;
    right: 15.5vw;

    @media only screen and (min-width: 2560px) {
        right: 400px;
        top: 520px;
    }
`

interface BannerCard {
    src: string

}

const BannerCard = ( {src} : BannerCard): JSX.Element =>{
    return(<>
        <BannerCardComponent>
            <Image src ={src} alt=" drunken dragon image banner" width = {800} height = {281} layout = "responsive"/>

            <BannerButton>

                <LinkDisable url="https://s2.drunkendragon.games/" openExternal = {true}>
                    <SimpleButton action={() => null}>Explore Collection</SimpleButton>
                </LinkDisable>
                
            </BannerButton>
            
        </BannerCardComponent>

    </>)
}

export default BannerCard