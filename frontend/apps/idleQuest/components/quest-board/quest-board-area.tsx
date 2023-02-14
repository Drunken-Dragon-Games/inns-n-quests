import styled, { css } from "styled-components"
import { useState } from "react"
import { PixelArtCss, PixelArtImage } from "../../../utils"
import { AvailableQuest } from "../../dsl"
import PropStamp from "./prop-stamp"

const QuestBoardAreaContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10vmax;
`

const QuestPreviewCardContainer = styled.div`
    position: relative;
    cursor: pointer;
    width: 16vmax;
    height: 16vmax;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

`

const Title = styled.h2`
    width: %100; 
    display: block;
    z-index: 1;
    text-align: center;
    padding: 0 1.5vmax 1vmax 1.5vmax;
    font-family: VT323;
    font-size: 1.2vmax;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
`

const PaperBackground = styled.div`
    position: absolute;
    width: 16vmax;
    height: 16vmax;
    ${PixelArtCss}
`

const PaperBackgroundHoverCommon = css<{hovering: boolean}>`
    opacity: ${props => props.hovering ? 1 : 0};
    transition: opacity 0.3s;
    outline:none;
    filter: drop-shadow(0px 0px 10px yellow);
    -webkit-filter: drop-shadow(0px 0px 10px yellow);
`

const PaperBackgroundHover1 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.3vmax;
    left: 0.5vmax;
    width: 15.2vmax;
    height: 15.4vmax;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover2 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.3vmax;
    left: 0.4vmax;
    width: 15.2vmax;
    height: 15.4vmax;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover3 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.2vmax;
    left: 0.2vmax;
    width: 15.7vmax;
    height: 15.9vmax;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover4 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.2vmax;
    left: 0.3vmax;
    width: 15.4vmax;
    height: 15.6vmax;
    ${PaperBackgroundHoverCommon}
`

const MonsterWrapper = styled(PixelArtImage)`
    position: absolute;
    top: 5vmax;
    left: 6vmax;
    height: 8vmax;
    width: 4vmax;
    ${PixelArtCss}
`

const QuestPreviewCard = ({ quest, onQuestClick }: { quest: AvailableQuest, onQuestClick: (quest: AvailableQuest) => void }) => {
    const questStyle = quest.paper
    const [hovering, setHovering] = useState(false)
    const PaperBackgroundHover = [PaperBackgroundHover1, PaperBackgroundHover2, PaperBackgroundHover3, PaperBackgroundHover4][questStyle - 1]!
    return (
        <QuestPreviewCardContainer onClick={() => onQuestClick(quest)} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <PaperBackgroundHover
                hovering={hovering}
                src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_${questStyle}_onhover.webp`}
                alt="quest hover image"
                absolute
                fill
            />
            <PixelArtImage
                src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_${questStyle}.webp`}
                alt="quest paper image"
                absolute
                fill
            />
            <Title>{quest.name}</Title>
            <PixelArtImage
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                alt="quest monster preview"
                width={8.5} height={8.5}
            />
            <PropStamp rarity={quest.seal} />
        </QuestPreviewCardContainer>
    )
}

interface QuestBoardAreaProps {
    className?: string
    availableQuests: AvailableQuest[]
    onQuestClick: (quest: AvailableQuest) => void
}

const QuestBoardArea = ({ className, availableQuests, onQuestClick }: QuestBoardAreaProps) =>
    <QuestBoardAreaContainer className={className}>
        {availableQuests.slice(0, 5).map((quest: AvailableQuest, index: number) => 
            <QuestPreviewCard quest={quest} key={"quest-" + index} onQuestClick={onQuestClick} />
        )}
    </QuestBoardAreaContainer>

export default QuestBoardArea