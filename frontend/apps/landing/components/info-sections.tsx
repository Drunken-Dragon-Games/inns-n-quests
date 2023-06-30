import styled from "styled-components"
import { colors, OswaldFontFamily, MessiriFontFamily } from "../../common"
import { LandingPageSection } from "./common"

const SectionContainer = styled(LandingPageSection)`
    background-color: ${colors.dduBackground};
    height: 480px;
    color: white;
`

const SectionBackground = styled.div<{ image: string, borderColor: string }>`
    background-image: url(${props => props.image});
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    border: 1px solid ${props => props.borderColor};
    position: relative;
`

const LeaningSection = styled.div`
    width: 100%;
    max-width: 600px;
    height: 100%;
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;

    h2 {
        ${OswaldFontFamily}
        font-size: 50px;
        width: 100%;
    }

    p {
        ${MessiriFontFamily}
        font-size: 18px;
        width: 100%;
        margin-bottom: 20px;
        color: ${colors.textBeige};
        font-weight: bold;
    }
`

const LeftLeaningInfoContainer = styled(LeaningSection)`
    left: 50%;
    text-align: right;
`

const RightLeaningInfoContainer = styled(LeaningSection)`
    right: 50%;
    text-align: left;
`

export const LeftLeaningSection = (props: { title: string, content: string[], image: string, borderColor: string }) =>
    <SectionContainer>
        <SectionBackground image={props.image} borderColor={props.borderColor}>
            <LeftLeaningInfoContainer>
                <h2>{props.title}</h2>
                { props.content.map((c, i) => <p key={i}>{c}</p>) }
            </LeftLeaningInfoContainer>
        </SectionBackground>
    </SectionContainer>

export const RightLeaningSection = (props: { title: string, content: string[], image: string, borderColor: string }) =>
    <SectionContainer>
        <SectionBackground image={props.image} borderColor={props.borderColor}>
            <RightLeaningInfoContainer>
                <h2>{props.title}</h2>
                { props.content.map((c, i) => <p key={i}>{c}</p>) }
            </RightLeaningInfoContainer>
        </SectionBackground>
    </SectionContainer>
