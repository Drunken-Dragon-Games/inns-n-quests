import styled from "styled-components"
import Image from "next/image"

const BannerCardMobileContainer = styled.div`
    width: 100vw;
    height: 50vw;
`
const BannerCardMobile = () : JSX.Element =>{
    return (<>
        <BannerCardMobileContainer>
            <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/banner_mobile.webp" alt="banner drunken dragon" width={5} height={7.5} layout="responsive"/>
        </BannerCardMobileContainer>
    </>)
}

export default BannerCardMobile