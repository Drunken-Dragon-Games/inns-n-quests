import Image from "next/image"
import styled from "styled-components"
import { LandingPageSection } from "./common"
import { MessiriFontFamily, OswaldFontFamily } from "../../common"
import { useState } from "react"

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

const Button = styled.div`
    ${OswaldFontFamily}
    border: 1px solid #ea3012;
    background: rgba(159,22,0,.6);
    user-select: none;
    cursor: pointer;
    color: #f7b10a;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 400;
    padding: 12px 30px;
    border-radius: 2px;
    text-align: center;

    &:hover {
        background: rgba(159,22,0,.8);
    }
`


const ComicSection = () => {
    const [page, setPage] = useState(0)
    return <ComicSectionContainer>
        <TitleWrapper>
            <h2>Explore The Adventures Of The Dead Queen</h2>
            <a href="" target="_blank"><Button>Buy Comic</Button></a>
            <p>Tap to turn pages...</p>
        </TitleWrapper>
        <PagesWrapper onClick={() => setPage((page + 1) % 3)}>
            <Page1 page={page}>
                <Image src="/landing/book_7.jpg" alt="Drunken Dragon Universe Comic Page 1" width="1050" height="1575" layout="responsive" />
            </Page1>
            <Page2 page={page}>
                <Image src="/landing/book_8.jpg" alt="Drunken Dragon Universe Comic Page 1" width="1050" height="1575" layout="responsive" />
            </Page2>
            <Page3 page={page}>
                <Image src="/landing/book_9.jpg" alt="Drunken Dragon Universe Comic Page 1" width="1050" height="1575" layout="responsive" />
            </Page3>
        </PagesWrapper>
    </ComicSectionContainer>
}

export default ComicSection
