import styled from "styled-components"
import { CrispPixelArtBackground } from "../../../../../utils"

const LabelComponent = styled.div`
    position: absolute;
    width: 3.5vw;
    height: 3vw;
`

const TextWrapper = styled.div`
    position: absolute;
    width: inherit;
    height: inherit;
`

const LabelText = styled.p`
    font-family: VT323;
    font-size: 0.8vw;
    color: #FDE395;
    line-height: 1.2vw;
    font-weight: 100;
    text-transform: uppercase;
    text-align: center;
`

const LabelTextLevel = styled.p`
    font-family: VT323;
    font-size: 1.5vw;
    color: #FDE395;
    line-height: 1.2vw;
    font-weight: 100;
    text-transform: uppercase;
    text-align: center;
`

const QuestLabelLevel = ({ className, children}: { className?: string, children: string }) => 
    <LabelComponent className={className}>
        <CrispPixelArtBackground
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/label.svg"
            layout="fill"
            alt="Label level drunken dragon" />

        <TextWrapper>
            <LabelText>Level</LabelText>
            <LabelTextLevel>{children}</LabelTextLevel>
        </TextWrapper>
    </LabelComponent>

export default QuestLabelLevel