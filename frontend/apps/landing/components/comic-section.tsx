import Image from "next/image"
import styled from "styled-components"
import { LandingPageSection } from "./common"
import { MessiriFontFamily, OswaldFontFamily } from "../../common"
import { useState } from "react"
import LandingButton from "./landing-button"

const ComicSectionContainer = styled(LandingPageSection)`
    padding: 50px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const PagesWrapper = styled.div`
    width: 100%;
    max-width: 1100px;
    height: 100%;
    max-height: 1650px;
    position: relative;
    z-index: 2;
`

const Page = styled.div<{ page: number }>`
    position: absolute;
    width: 100%;
    filter: drop-shadow(0px 0px 10px black);
    transition: 1000ms ease-in-out;
    cursor: pointer;
`

const Page1 = styled(Page)`
    ${props => props.page === 0 ? `
        z-index: 10;
        transform: translateX(0px) scale(1);
        filter: brightness(1);
    ` : props.page === 1 ? `
        z-index: 9;
        transform: translateX(-50px) scale(0.95);
        filter: brightness(0.6);
    ` : `
        z-index: 8;
        transform: translateX(-100px) scale(0.9);
        filter: brightness(0.3);
    `}
`

const Page2 = styled(Page)`
    ${props => props.page === 0 ? `
        z-index: 9;
        transform: translateX(50px) scale(0.95);
        filter: brightness(0.6);
    ` : props.page === 1 ? `
        z-index: 10;
        transform: translateX(0px) scale(1);
        filter: brightness(1);
    ` : `
        z-index: 8;
        transform: translateX(-50px) scale(0.95);
        filter: brightness(0.6);
    `}
`

const Page3 = styled(Page)`
    ${props => props.page === 0 ? `
        z-index: 8;
        transform: translateX(100px) scale(0.9);
        filter: brightness(0.3);
    ` : props.page === 1 ? `
        z-index: 9;
        transform: translateX(50px) scale(0.95);
        filter: brightness(0.6);
    ` : `
        z-index: 10;
        transform: translateX(0px) scale(1);
        filter: brightness(1);
    `}
`

const TitleWrapper = styled.div`
    width: 100%;
    max-width: 300px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
    padding: 0px 0px 10px 0px;

    h2 {
        ${OswaldFontFamily}
        font-size: 40px;
        color: white;
    }

    p {
        ${MessiriFontFamily}
        color: white;
    }
`

const ComicSection = () => {
    const [page, setPage] = useState(0)
    return <ComicSectionContainer>
        <TitleWrapper>
            <h2>Explore The Adventures Of The Dead Queen</h2>
            <LandingButton 
                href="https://www.amazon.com/Drunken-Dragon-Universe-Queen-Lockbox-ebook/dp/B0C6FSFLMT/ref=sr_1_1?crid=2JE2TKN03ZPK4&keywords=drunken+dragon+the+dead+queen&qid=1688516012&sprefix=%2Caps%2C131&sr=8-1" 
                target="_blank">Buy Comic</LandingButton>
            <p>Tap to turn pages...</p>
        </TitleWrapper>
        <PagesWrapper onClick={() => setPage((page + 1) % 3)}>
            <Page1 page={page}>
                <Image src="https://cdn.ddu.gg/modules/landing/book_7.jpg" alt="Drunken Dragon Universe Comic Page 1" width="1050" height="1575" layout="responsive" />
            </Page1>
            <Page2 page={page}>
                <Image src="https://cdn.ddu.gg/modules/landing/book_8.jpg" alt="Drunken Dragon Universe Comic Page 1" width="1050" height="1575" layout="responsive" />
            </Page2>
            <Page3 page={page}>
                <Image src="https://cdn.ddu.gg/modules/landing/book_9.jpg" alt="Drunken Dragon Universe Comic Page 1" width="1050" height="1575" layout="responsive" />
            </Page3>
        </PagesWrapper>
    </ComicSectionContainer>
}

export default ComicSection
