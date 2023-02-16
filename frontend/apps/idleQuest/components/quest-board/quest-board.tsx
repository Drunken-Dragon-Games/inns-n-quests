import styled from "styled-components"
import { AvailableQuest } from "../../dsl"
import QuestBoardArea from "./quest-board-area"
import RefreshButton from "./refresh-button"
import WorldMap from "./world-map"

const QuestBoardContainer = styled.div`
    height: 100vh;
    flex: 1;
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

interface QuestBoardProps {
    availableQuests: AvailableQuest[],
    onSelectQuest: (quest: AvailableQuest) => void,
    onFetchMoreQuests: () => void
}

const QuestBoard = ({ availableQuests, onSelectQuest, onFetchMoreQuests }: QuestBoardProps) =>
    <QuestBoardContainer>
        <AvailableQuestsWrapper>
            <QuestBoardArea availableQuests={availableQuests} onQuestClick={onSelectQuest} />
            <RefreshButton onClick={onFetchMoreQuests} />
        </AvailableQuestsWrapper>
    </QuestBoardContainer>

export default QuestBoard 