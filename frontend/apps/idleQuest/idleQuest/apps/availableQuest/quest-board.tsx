import styled from "styled-components"
import { CrispPixelArtImage } from "../../../../utils"
import { Adventurer, AvailableQuest, SelectedQuest } from "../../../dsl"
import { RefreshButton } from "./components/basic_components"
import { AvailableQuestsArea, QuestCard, WorldMap } from "./components/complex"

const QuestBoardContainer = styled.div`
    width: 85%;
    height: 100vh;
    background-color: #523438;
    display: flex;
    position: relative;
    overflow: hidden;
`

const AvailableQuestsWrapper = styled.div`
    width: 80vw;
    height: 50vw;
    position: relative;
    margin: auto;
`

const Background = styled.div`
    position: absolute;
    width: 80vw;
    height: inherit;
    top: 1vw;
`

const QuestBoardBackground = () =>
    <Background>
        <CrispPixelArtImage
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp"
            alt="quest board background"
            width={2100}
            height={1250}
            layout="responsive" />
    </Background>

interface QuestBoardProps {
    selectedQuest?: SelectedQuest,
    adventurerSlots: (Adventurer | null)[],
    availableQuests: AvailableQuest[],
    onSignQuest: (quest: SelectedQuest) => void,
    onCloseQuest: () => void,
    onSelectQuest: (quest: AvailableQuest) => void,
    onFetchMoreQuests: () => void
    onUnselectAdventurer: (adventurer: Adventurer) => void,
}

const QuestBoard = ({ selectedQuest, adventurerSlots, availableQuests, onSignQuest, onCloseQuest, onSelectQuest, onFetchMoreQuests, onUnselectAdventurer }: QuestBoardProps) =>
    <QuestBoardContainer>
        <AvailableQuestsWrapper>
            <QuestBoardBackground />
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