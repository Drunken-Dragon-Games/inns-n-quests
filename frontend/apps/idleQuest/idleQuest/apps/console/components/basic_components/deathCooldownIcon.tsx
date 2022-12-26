import Image from "next/image"
import styled from "styled-components"

const ImageWrapper = styled.div`
    width: 1.8vw;
    height: 1.8vw;

    img{
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
`

const DeathCoolDownIcon = () => {
    return(
    <>
        <ImageWrapper>
            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/emoji_healing.webp"  alt="drunken Dragon idle adventurers" width={10} height={10} layout="responsive" />
        </ImageWrapper>
    </>)
}

export default DeathCoolDownIcon