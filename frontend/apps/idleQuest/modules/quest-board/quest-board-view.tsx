import styled, { keyframes } from "styled-components"
import { AvailableQuest } from "../../dsl"
import { PixelArtImage, vh1 } from "../../utils"
import QuestBoardArea from "./components/quest-board-area"
import RefreshButton from "./components/refresh-button"
import { QuestBoardState } from "./quest-board-state"
import { QuestBoardTransitions } from "./quest-board-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const QuestBoardContainer = styled.div<{ open: boolean }>`
    height: 100%;
    width: 100%;
    background-color: rgba(20,20,20,0.3);
    backdrop-filter: blur(5px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
    #background-color: #523438;
    display: flex;
    position: relative;
    overflow: hidden;
    #background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp");
    #background-repeat: no-repeat;
    #background-position: center;
`

const AvailableQuestsWrapper = styled.div`
    width: 80vw;
    height: 50vw;
    position: relative;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 1vh;
`

const QuestBoardBackground = styled(PixelArtImage)`
    border-radius: 1vh;
    overflow: hidden;
    filter: drop-shadow(0px 0px 10px black);
`

interface QuestBoardViewProps {
    className?: string,
    questBoardState: QuestBoardState,
    questBoardTransitions: QuestBoardTransitions,
    onQuestClick: (quest: AvailableQuest) => void,
}

const QuestBoardView = ({ className, questBoardState, questBoardTransitions, onQuestClick }: QuestBoardViewProps) =>
    <QuestBoardContainer className={className} open={questBoardState.open}>
        <AvailableQuestsWrapper>
            <QuestBoardBackground
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp"
                alt="Quest Board Background"
                width={100}
                height={60}
                units={vh1}
                absolute
            />
            <QuestBoardArea availableQuests={questBoardState.availableQuests} onQuestClick={onQuestClick} />
            <RefreshButton onClick={questBoardTransitions.onClearAvailableQuests} />
        </AvailableQuestsWrapper>
    </QuestBoardContainer>

export default QuestBoardView 