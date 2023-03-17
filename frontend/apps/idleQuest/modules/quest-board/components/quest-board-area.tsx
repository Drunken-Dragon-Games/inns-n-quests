import { useEffect, useState } from "react"
import styled, { css } from "styled-components"
import { AvailableStakingQuest, PixelArtImage, vh } from "../../../common"
import { questSeal } from "../../inventory/inventory-dsl"
import { useQuestBoardSelector } from "../quest-board-state"
import QuestBoardTransitions from "../quest-board-transitions"
import PropStamp from "./miniature-seal"

const QuestBoardAreaContainer = styled.div`
    width: 100%;
    font-family: VT323;
    color: #793312;
    z-index: 2;
`

const ScrollingArea = styled.div`
    display: flex;

    @media (min-width: 1025px) {
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    @media (max-width: 1024px) {
        overflow-x: scroll;
        
        ::-webkit-scrollbar {
            height: 0px; 
            width: 0px;
        }
    }
`

const QuestPreviewCardContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: 1025px) {
        cursor: pointer;
        width: 30vh;
        height: 30vh;
    }

    @media (max-width: 1024px) {
        padding: 3vh;
    }
`

const Title = styled.h2`
    z-index: 1;
    text-align: center;
    padding: 0 1.5vh 1vh 1.5vh;
    font-size: 2vh;
    text-transform: uppercase;
`

const PaperBackgroundHoverCommon = css<{hovering: boolean}>`
    opacity: ${props => props.hovering ? 1 : 0};
    transition: opacity 0.3s;
    outline:none;
    filter: drop-shadow(0px 0px 10px yellow);
    -webkit-filter: drop-shadow(0px 0px 10px yellow);
`

const PaperBackgroundHover1 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.25vh;
    left: 0.45vh;
    width: 28.6vh;
    height: 29.1vh;
    ${PaperBackgroundHoverCommon}
    filter: drop-shadow(0px 0px 10px purple);
    -webkit-filter: drop-shadow(0px 0px 10px purple);
`

const PaperBackgroundHover2 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.3vh;
    left: 0.4vh;
    width: 15.2vh;
    height: 15.4vh;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover3 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.2vh;
    left: 0.2vh;
    width: 15.7vh;
    height: 15.9vh;
    ${PaperBackgroundHoverCommon}
`

const PaperBackgroundHover4 = styled(PixelArtImage)<{hovering: boolean}>`
    top: 0.2vh;
    left: 0.3vh;
    width: 15.4vh;
    height: 15.6vh;
    ${PaperBackgroundHoverCommon}
`

const QuestPreviewCard = ({ quest }: { quest: AvailableStakingQuest }) => {
    const questStyle = 1
    const [hovering, setHovering] = useState(false)
    const PaperBackgroundHover = [PaperBackgroundHover1, PaperBackgroundHover2, PaperBackgroundHover3, PaperBackgroundHover4][questStyle - 1]!
    const seal = questSeal(quest)
    return (
        <QuestPreviewCardContainer 
            onClick={() => QuestBoardTransitions.onClickAvailableQuest(quest)} 
            onMouseEnter={() => setHovering(true)} 
            onMouseLeave={() => setHovering(false)}
        >
            <PaperBackgroundHover
                hovering={hovering}
                src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_${questStyle}_onhover.webp`}
                alt="quest hover image"
                absolute
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
                width={10} height={10}
                units={vh(1.8)}
            />
            <PropStamp rarity={seal} />
        </QuestPreviewCardContainer>
    )
}

const QuestBoardArea = () => {
    const availableQuests = useQuestBoardSelector(state => state.availableQuests)
    // Makes sure there are always at least 5 quests in the board
    useEffect(() => {
        if (availableQuests.length < 5) 
            QuestBoardTransitions.onFetchAvailableQuests()
    }, [availableQuests.length])
    return (
        <QuestBoardAreaContainer>
            <ScrollingArea>
            {availableQuests.slice(0, 5).map((quest: (AvailableStakingQuest), index: number) =>
                <QuestPreviewCard quest={quest} key={"quest-" + index} />
            )}
            </ScrollingArea>
        </QuestBoardAreaContainer>
    )
}

export default QuestBoardArea