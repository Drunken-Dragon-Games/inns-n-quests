import styled from "styled-components"
import { Adventurer, AvailableQuest, SelectedQuest } from "../../../dsl"
import { RefreshButton } from "./components"
import { AvailableQuestsArea, QuestCard, WorldMap } from "./components"

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
    selectedQuest?: SelectedQuest,
    adventurerSlots: (Adventurer | null)[],
    availableQuests: AvailableQuest[],
    onSignQuest: (quest: SelectedQuest, adventurers: Adventurer[]) => void,
    onCloseQuest: () => void,
    onSelectQuest: (quest: AvailableQuest) => void,
    onFetchMoreQuests: () => void
    onUnselectAdventurer: (adventurer: Adventurer) => void,
}

const QuestBoard = ({ selectedQuest, adventurerSlots, availableQuests, onSignQuest, onCloseQuest, onSelectQuest, onFetchMoreQuests, onUnselectAdventurer }: QuestBoardProps) =>
    <QuestBoardContainer>
        <AvailableQuestsWrapper>
            <AvailableQuestsArea availableQuests={availableQuests} onQuestClick={onSelectQuest} />
            <WorldMap />
            <RefreshButton onClick={onFetchMoreQuests} />
        </AvailableQuestsWrapper>
        <QuestCard
            quest={selectedQuest}
            adventurerSlots={adventurerSlots}
            onSign={onSignQuest}
            onClose={onCloseQuest}
            onUnselectAdventurer={onUnselectAdventurer}
        />
    </QuestBoardContainer>

export default QuestBoard 