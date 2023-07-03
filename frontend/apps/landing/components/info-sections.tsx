import styled from "styled-components"
import { colors, OswaldFontFamily, MessiriFontFamily } from "../../common"
import { LandingPageSection } from "./common"
import LandingButton from "./landing-button"

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

const BttnWrapper = styled.div`
    width: 100%;
    text-align: center;
`

const Bttn = styled(LandingButton)`
    width: 150px;
`

type SectionProps = {
    title: string, 
    content: string[], 
    image: string, 
    borderColor: string, 
    link?: { 
        href: string, 
        text: string 
    }
}

export const LeftLeaningSection = (props: SectionProps) =>
    <SectionContainer>
        <SectionBackground image={props.image} borderColor={props.borderColor}>
            <LeftLeaningInfoContainer>
                <h2>{props.title}</h2>
                { props.content.map((c, i) => <p key={i}>{c}</p>) }
                { props.link && <BttnWrapper><Bttn href={props.link.href} target="_blank">{props.link.text}</Bttn></BttnWrapper> }
            </LeftLeaningInfoContainer>
        </SectionBackground>
    </SectionContainer>

export const RightLeaningSection = (props: SectionProps) =>
    <SectionContainer>
        <SectionBackground image={props.image} borderColor={props.borderColor}>
            <RightLeaningInfoContainer>
                <h2>{props.title}</h2>
                { props.content.map((c, i) => <p key={i}>{c}</p>) }
                { props.link && <BttnWrapper><Bttn href={props.link.href} target="_blank">{props.link.text}</Bttn></BttnWrapper> }
            </RightLeaningInfoContainer>
        </SectionBackground>
    </SectionContainer>
