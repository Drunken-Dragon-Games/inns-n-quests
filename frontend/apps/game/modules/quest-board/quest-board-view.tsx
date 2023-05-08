import { Provider } from "react-redux"
import styled, { keyframes } from "styled-components"
import { PixelArtImage, vh, vh1 } from "../../../common"
import { useIsMobile } from "../../../is-mobile"
import QuestBoardArea from "./components/quest-board-area"
import RefreshButton from "./components/refresh-button"
import { questBoardStore, useQuestBoardSelector } from "./quest-board-state"
import QuestBoardTransitions from "./quest-board-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const QuestBoardContainer = styled.div<{ open: boolean, mobile: boolean }>`
    height: 100%;
    width: 100%;
    background-color: rgba(20,20,20,0.3);
    backdrop-filter: blur(5px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    display: flex;
    position: relative;
    overflow: hidden;
    
    animation: ${props => !props.mobile && (props.open ? openAnimation : closeAnimation)} 0.5s ease-in-out;
`

const AvailableQuestsWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 1025px) {
        width: 100vh;
        height: 60vh;
        padding: 3vh;
        margin: auto;
        border-radius: 1vh;
        flex-direction: column;
    }

    @media (max-width: 1024px) {
        width: 100%;
        height: calc(100% - 17vh - 39px);
    }
`

const QuestBoardBackground = styled(PixelArtImage)`
    border-radius: 1vh;
    overflow: hidden;
    filter: drop-shadow(0px 0px 10px black);
`

const QuestBoard = ({ className }: { className?: string }) => {
    const open = useQuestBoardSelector(state => state.open)
    const isMobile = useIsMobile()
    return (
        <QuestBoardContainer className={className} open={open} mobile={isMobile} onClick={() => QuestBoardTransitions.onToggleQuestBoard() }>
            <AvailableQuestsWrapper onClick={(e) => e.stopPropagation()}>
                <QuestBoardBackground
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp"
                    alt="Quest Board Background"
                    width={100}
                    height={60}
                    units={isMobile ? vh(0.8) : vh1}
                    absolute
                />
                <QuestBoardArea />
                <RefreshButton onClick={QuestBoardTransitions.onClearAvailableQuests} />
            </AvailableQuestsWrapper>
        </QuestBoardContainer>
    )
}

const QuestBoardView = ({ className }: { className?: string }) =>
    <Provider store={questBoardStore}>
        <QuestBoard className={className} />
    </Provider>

export default QuestBoardView 