import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

const BannerCardMobileContainer = styled.div`
    width: 100vw;
    height: 50vw;
`

const BannerCardMobile = () =>
    <Link href="/s2" passHref legacyBehavior>
        <a>
            <BannerCardMobileContainer>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/banner_mobile.webp" alt="banner drunken dragon" width={5} height={7.5} layout="responsive" />
            </BannerCardMobileContainer>
        </a>
    </Link>

export default BannerCardMobile