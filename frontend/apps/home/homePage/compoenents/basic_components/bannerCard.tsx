import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"
import { SimpleButton } from "../../../../utils/components/basic_components"


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

            <Link href="/s2" passHref>
                <BannerButton>
                    <SimpleButton>Explore Collection</SimpleButton>
                </BannerButton>
            </Link>
            
        </BannerCardComponent>

    </>)
}

export default BannerCard