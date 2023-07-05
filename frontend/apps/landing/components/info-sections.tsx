import styled from "styled-components"
import { colors, OswaldFontFamily, MessiriFontFamily } from "../../common"
import { LandingPageSection } from "./common"
import LandingButton from "./landing-button"

const SectionContainer = styled(LandingPageSection)`
    background-color: ${colors.dduBackground};
    height: 480px;
    color: white;

    @media (max-width: 820px) {
        height: auto;
    }
`

const SectionBackground = styled.div<{ image: string, borderColor: string, leaning: "left" | "right" }>`
    background-image: url(${props => props.image});
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    border: 1px solid ${props => props.borderColor};
    position: relative;

    @media (max-width: 820px) {
        background-size: 1200px 240px;
        background-repeat: no-repeat;
        background-position: ${ props => props.leaning == "left" ? "top left 30%" : "top right 30%" };
        background-color: ${props => props.borderColor};
    }
`

const LeaningSection = styled.div<{ borderColor: string }>`
    width: 100%;
    max-width: 600px;
    height: 100%;
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;

    @media (max-width: 1024px) {
        padding: 0px 20px;
        width: 60%;
    }

    @media (max-width: 820px) {
        width: 100%;
        position: relative;
        margin-top: 240px;
        gap: 30px;
    }

    h2 {
        ${OswaldFontFamily}
        font-size: 50px;
        width: 100%;

        @media (max-width: 1024px) {
            font-size: 40px;
            text-shadow: 0px 0px 5px black;
        }

        @media (max-width: 820px) {
            font-size: 24px;
        }
    }

    p {
        ${MessiriFontFamily}
        font-size: 18px;
        width: 100%;
        margin-bottom: 20px;
        color: ${colors.textBeige};
        font-weight: bold;

        @media (max-width: 1024px) {
            text-shadow: 0px 0px 20px ${props => props.borderColor};
            filter: drop-shadow(0px 0px 5px black);
        }

        @media (max-width: 820px) {
            font-size: 14px;
            line-height: 20px;
            text-shadow: none;
            filter: drop-shadow(0px 0px 0px black);
        }
    }
`

const LeftLeaningInfoContainer = styled(LeaningSection)`
    left: 50%;
    text-align: right;
    @media (max-width: 1024px) {
        left: 40%;
    }
    @media (max-width: 820px) {
        left: 0;
        text-align: center;
    }
`

const RightLeaningInfoContainer = styled(LeaningSection)`
    right: 50%;
    text-align: left;
    @media (max-width: 1024px) {
        right: 40%;
    }
    @media (max-width: 820px) {
        left: 0;
        right: auto;
        text-align: center;
    }
`

const BttnWrapper = styled.div`
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
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
        <SectionBackground image={props.image} borderColor={props.borderColor} leaning="left">
            <LeftLeaningInfoContainer borderColor={props.borderColor}>
                <h2>{props.title}</h2>
                { props.content.map((c, i) => <p key={i}>{c}</p>) }
                { props.link && <BttnWrapper><Bttn href={props.link.href} target="_blank">{props.link.text}</Bttn></BttnWrapper> }
            </LeftLeaningInfoContainer>
        </SectionBackground>
    </SectionContainer>

export const RightLeaningSection = (props: SectionProps) =>
    <SectionContainer>
        <SectionBackground image={props.image} borderColor={props.borderColor} leaning="right">
            <RightLeaningInfoContainer borderColor={props.borderColor}>
                <h2>{props.title}</h2>
                { props.content.map((c, i) => <p key={i}>{c}</p>) }
                { props.link && <BttnWrapper><Bttn href={props.link.href} target="_blank">{props.link.text}</Bttn></BttnWrapper> }
            </RightLeaningInfoContainer>
        </SectionBackground>
    </SectionContainer>
