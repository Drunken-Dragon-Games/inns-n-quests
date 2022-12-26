import Image from "next/image"
import styled from "styled-components"

const FooterBackgroundWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`

const FooterBackgroundComponent = ():JSX.Element => {
    return (<FooterBackgroundWrapper>
        <Image
            src={"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/footer-background.png"}
            width={7}
            height={3}
            layout="fill"
            quality={100}
        />
    </FooterBackgroundWrapper>)
}

export default FooterBackgroundComponent