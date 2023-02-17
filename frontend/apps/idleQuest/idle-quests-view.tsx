import { useSelector } from "react-redux"
import styled from "styled-components"
import { ConditionalRender, Loading } from "../utils/components/basic_components"
import AlphaNotes from "./alpha-notes"
import AdventurerSplashArt from "./components/inventory/adventurer-splash-art"
import Inventory from "./components/inventory/inventory"
import { Notifications } from "./components/notifications"
import QuestBoard from "./components/quest-board"
import QuestCard from "./components/quest-board/quest-card"
import { IdleQuestsState, idleQuestsStore } from "./idle-quests-state"
import IdleQuestsTransitions from "./idle-quests-transitions"

const IdleQuestsContainer = styled.section`
    position: relative;
    width: 100vw;
    height: 100vh;
`

const BackGroundPositionAbsolute = styled.section`
    position: absolute;
    z-index: 10;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #0B1015;
`

const IdleQuestsView = () => {
    const snd = { 
        state: useSelector((state: IdleQuestsState) => state), 
        dispatch: idleQuestsStore.dispatch 
    }
    IdleQuestsTransitions.useInitEffects(snd)
    const dragonSilver = 0
    const dragonSilverToClaim = 0
    
    return(
        <IdleQuestsContainer>
            <ConditionalRender condition={snd.state.questBoard.initLoading}>
                <BackGroundPositionAbsolute>
                    <Loading size={8} />
                </BackGroundPositionAbsolute>
            </ConditionalRender>

            <Notifications notifications={snd.state.notifications.notifications} />
            <Inventory
                open={snd.state.questBoard.inventoryOpen}
                adventurers={snd.state.questBoard.adventurers}
                adventurerSlots={snd.state.questBoard.adventurerSlots}
                selectedQuest={snd.state.questBoard.selectedQuest}
                takenQuests={snd.state.questBoard.takenQuests}
                selectedAdventurer={snd.state.questBoard.selectedAdventurer}
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                onAdventurerRecruit={IdleQuestsTransitions.onRecruitAdventurer(snd)}
                onItemClick={IdleQuestsTransitions.onItemClick(snd)}
                onClickClose={IdleQuestsTransitions.onToggleInventory(snd)}
            > 
            { snd.state.questBoard.selectedQuest ?
                <QuestCard
                    quest={snd.state.questBoard.selectedQuest}
                    adventurerSlots={snd.state.questBoard.adventurerSlots}
                    onSign={IdleQuestsTransitions.onSignQuest(snd)}
                    onUnselectAdventurer={IdleQuestsTransitions.onUnselectAdventurer(snd)}
                />
            : snd.state.questBoard.selectedAdventurer ?
                <AdventurerSplashArt
                    adventurer={snd.state.questBoard.selectedAdventurer}
                />
            : <></> } 
            </Inventory>

            <QuestBoard
                availableQuests={snd.state.questBoard.availableQuests}
                onSelectQuest={IdleQuestsTransitions.onSelectQuest(snd)}
                onFetchMoreQuests={IdleQuestsTransitions.onFetchMoreQuests(snd)}
            />
            <AlphaNotes />
        </IdleQuestsContainer>
    )
}

export default IdleQuestsView
