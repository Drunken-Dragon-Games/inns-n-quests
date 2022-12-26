import styled from "styled-components";
import Image from "next/image";

const IdleQuestsImageWrapper = styled.div`
    width: 55%;
    max-width: 1100px;
    padding-left: 3vw;
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 100%;
        margin-bottom: 35px;
    }
`
const DragonSilverSymbolContainer = styled.div`
    width: 17.5vw;
    position: absolute;
    right: 1.042vw;
    top: -6.250vw
`

const IdleQuestsImage = ():JSX.Element => {
    return (<IdleQuestsImageWrapper>
        <DragonSilverSymbolContainer>
            <Image
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/dragon_silver_symbol.svg"
                width={1}
                height={1}
                layout="responsive"
            />
        </DragonSilverSymbolContainer>
        <Image
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/board.webp"
            width={1}
            height={1}
            layout="responsive"
        />
    </IdleQuestsImageWrapper>)
}

export default IdleQuestsImage