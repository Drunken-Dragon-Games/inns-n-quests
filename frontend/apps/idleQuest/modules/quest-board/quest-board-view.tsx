import styled from "styled-components"
import { AvailableQuest } from "../../dsl"
import QuestBoardArea from "./components/quest-board-area"
import RefreshButton from "./components/refresh-button"
import { QuestBoardState } from "./quest-board-state"
import { QuestBoardTransitions } from "./quest-board-transitions"

const QuestBoardContainer = styled.div`
    height: 100%;
    width: 100%;
    background-color: #523438;
    display: flex;
    position: relative;
    overflow: hidden;
    background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp");
    background-repeat: no-repeat;
    background-position: center;
`

const AvailableQuestsWrapper = styled.div`
    width: 80vw;
    height: 50vw;
    position: relative;
    margin: auto;
`

interface QuestBoardViewProps {
    className?: string,
    questBoardState: QuestBoardState,
    questBoardTransitions: QuestBoardTransitions,
    onQuestClick: (quest: AvailableQuest) => void,
}

const QuestBoardView = ({ className, questBoardState, questBoardTransitions, onQuestClick }: QuestBoardViewProps) =>
    <QuestBoardContainer className={className}>
        <AvailableQuestsWrapper>
            <QuestBoardArea availableQuests={questBoardState.availableQuests} onQuestClick={onQuestClick} />
            <RefreshButton onClick={questBoardTransitions.onClearAvailableQuests} />
        </AvailableQuestsWrapper>
    </QuestBoardContainer>

export default QuestBoardView 