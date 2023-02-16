import { useState } from "react"
import styled from "styled-components"
import { PixelArtImage } from "../../../utils"
import { ConditionalRender, TextOswald } from "../../../utils/components/basic_components"
import { mapQuestScroll, TakenQuest, takenQuestStatus } from "../../dsl"
import InventoryBox from "./inventory-box"
import Timer from "./timer"

const TakenQuestCardContainer = styled(InventoryBox)`
    position: relative;
    cursor: pointer;
    display: flex;
    gap: 1vmax;
`

const QuestDetails = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`

const Title = styled.h2 <{ finished: boolean }>`
    color: ${props => props.finished  ? "#cba044": "white"};
    flex: 1;
    font-size: 0.9vmax;
    font-family: Oswald;
    font-weight: ${props => props.finished  ? "500": "200"};
    margin-bottom: 0.1vmax;
    text-transform: uppercase;
`

const HappeningText = styled(TextOswald)`
    text-transform: uppercase;
    text-align: center;
    font-weight: 200;
`

interface TakenQuestCardProps {
    takenQuest: TakenQuest,
    onSelectTakenQuest?: (takenQuest: TakenQuest) => void
}

const TakenQuestCard = ({ takenQuest, onSelectTakenQuest }: TakenQuestCardProps) => {
    const [onHover, setOnHover] = useState<boolean>(false)
    const status = takenQuestStatus(takenQuest)
    return (
        <TakenQuestCardContainer 
            onClick={() => onSelectTakenQuest && onSelectTakenQuest(takenQuest)} 
            onMouseEnter={() => setOnHover(true)} 
            onMouseLeave={() => setOnHover(false)}
            selected={onHover}
        >
            <PixelArtImage
                src={mapQuestScroll(takenQuest)}
                alt="unopened quest" 
                width={5} height={4.2}
            />

            <QuestDetails>
                <Title finished={status == "finished"}>{takenQuest.quest.name}</Title>
                <Timer takenQuest={takenQuest} />
                <ConditionalRender condition={status == "in-progress"}>
                    <HappeningText fontsize={0.8} color="white" textAlign="center">happening</HappeningText>
                </ConditionalRender>
            </QuestDetails>
        </TakenQuestCardContainer>
    )
}

export default TakenQuestCard