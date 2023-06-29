import Image from "next/image"
import styled from "styled-components"
import { colors, OswaldFontFamily, MessiriFontFamily } from "../../common"

const SectionContainer = styled.section`
    background-color: ${colors.dduBackground};
    width: 100vw;
    height: 500px;
    display: flex;
    justify-content: center;
    padding: 50px 0px;
`

const SectionTitleWrapper = styled.div`
    width: 100%;
    max-width: 590px;
    padding: 20px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 50px;

    h3 {
        display: block;
        ${OswaldFontFamily}
        color: ${colors.dduBackground};
        font-size: 36px;
        width: 100%;
        text-align: center;
    }
`

const SectionDescriptionWrapper = styled.div`
    width: 100%;
    max-width: 590px;
    padding: 20px;
    
    p {
        ${MessiriFontFamily}
        color: ${colors.dduBackground};
        font-size: 18px;
        width: 100%;
        margin-bottom: 20px;
    }
`

const SectionTitle = (props: { title: string }) =>
    <SectionTitleWrapper>
        <h3>{props.title}</h3>
        <Image src="/landing/decoration.png" width="100" height="50" />
    </SectionTitleWrapper>

const SectionDescription = (props: { content: string[] }) =>
    <SectionDescriptionWrapper>
        { props.content.map((c, i) => <p key={i}>{c}</p>) }
    </SectionDescriptionWrapper>

export const LeftLeaningSection = (props: { title: string, content: string[] }) =>
    <SectionContainer>
        <SectionTitle title={props.title} />
        <SectionDescription content={props.content} />
    </SectionContainer>

export const RightLeaningSection = (props: { title: string, content: string[] }) =>
    <SectionContainer>
        <SectionDescription content={props.content} />
        <SectionTitle title={props.title} />
    </SectionContainer>
