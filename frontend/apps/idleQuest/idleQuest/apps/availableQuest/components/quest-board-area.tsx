import { PropStamp } from "."
import Image from 'next/image'
import { AvailableQuest } from "../../../../dsl"
import styled, { css } from "styled-components"
import { useState } from "react"
import { CrispPixelArtCss, CrispPixelArtImage } from "../../../../../utils"

const Area = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10vw;
`

const QuestPreviewCardContainer = styled.div`
    cursor: pointer;
    width: 16vw;
    height: 16vw;
    position: relative;
`

const Title = styled.h2`
    position: absolute;
    top: 0vw;
    left: 0vw;
    width: 16vw; 
    height: 16vw;
    text-align: center;
    padding: 2.3vw 1.5vw;
    font-family: VT323;
    font-size: 1.2vw;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
`

const PaperBackground = styled.div`
    position: absolute;
    width: 16vw;
    height: 16vw;
    ${CrispPixelArtCss}
`

const PaperBackgroundHoverCommon = css<{ hovering: boolean }>`
    position: absolute;
    opacity: ${props => props.hovering ? 1 : 0};
    transition: opacity 0.3s;
    outline:none;
    filter: drop-shadow(0px 0px 10px yellow);
    -webkit-filter: drop-shadow(0px 0px 10px yellow);
    ${CrispPixelArtCss}
`
const PaperBackgroundHover1 = styled.div<{hovering: boolean}>`
    top: 0.3vw;
    left: 0.5vw;
    width: 15.2vw;
    height: 15.4vw;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover2 = styled.div<{hovering: boolean}>`
    top: 0.3vw;
    left: 0.4vw;
    width: 15.2vw;
    height: 15.4vw;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover3 = styled.div<{hovering: boolean}>`
    top: 0.2vw;
    left: 0.2vw;
    width: 15.7vw;
    height: 15.9vw;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover4 = styled.div<{hovering: boolean}>`
    top: 0.2vw;
    left: 0.3vw;
    width: 15.4vw;
    height: 15.6vw;
    ${PaperBackgroundHoverCommon}
`

const MonsterWrapper = styled.div`
    position: absolute;
    top: 5vw;
    left: 6vw;
    height: 8vw;
    width: 4vw;
    ${CrispPixelArtCss}
`

interface QuestBoardAreaProps {
    className?: string
    availableQuests: AvailableQuest[]
    onQuestClick: (quest: AvailableQuest) => void
}

const QuestBoardArea = ({ className, availableQuests, onQuestClick }: QuestBoardAreaProps) => {

    const QuestPreviewCard = ({ quest }: { quest: AvailableQuest }) => {
        const questStyle = quest.paper
        const [hovering, setHovering] = useState(false)
        const PaperBackgroundHover = [PaperBackgroundHover1, PaperBackgroundHover2, PaperBackgroundHover3, PaperBackgroundHover4][questStyle-1]!
        return (
            <QuestPreviewCardContainer onClick={() => onQuestClick(quest)} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <PaperBackgroundHover hovering={hovering}>
                    <Image
                        src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_${questStyle}_onhover.webp`}
                        alt="quest hover image"
                        layout="fill"
                    />
                </PaperBackgroundHover>
                <PaperBackground>
                    <Image
                        src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_${questStyle}.webp`}
                        alt="quest paper image"
                        layout="fill"
                    />
                </PaperBackground>
                <Title>{quest.name}</Title>
                <MonsterWrapper>
                    <CrispPixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/monsters/monstruo.webp"
                        alt="quest monster preview"
                        layout="fill"
                    />
                </MonsterWrapper>
                <PropStamp rarity={quest.seal} />
            </QuestPreviewCardContainer>
        )
    }

    return (
        <Area className={className}>
            {availableQuests.slice(0, 5).map((quest: AvailableQuest, index: number) => <QuestPreviewCard quest={quest} key={"quest-"+index} />)}
        </Area>
    )
}

export default QuestBoardArea