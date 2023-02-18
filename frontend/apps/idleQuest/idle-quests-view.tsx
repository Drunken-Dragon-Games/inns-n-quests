import { useSelector } from "react-redux"
import styled from "styled-components"
import { ConditionalRender, Loading } from "../utils/components/basic_components"
import AlphaNotes from "./alpha-notes"
import QuestSheet from "./common-components/quest-sheet/quest-sheet"
import { IdleQuestsState, idleQuestsStore } from "./idle-quests-state"
import { idleQuestsTransitions, useInitEffects } from "./idle-quests-transitions"
import { InventoryView } from "./modules/inventory"
import AdventurerSplashArt from "./modules/inventory/components/adventurer-splash-art"
import { NotificationsView } from "./modules/notifications"
import QuestBoardView from "./modules/quest-board"
import { WorldView } from "./modules/world"

const IdleQuestsContainer = styled.section`
    position: relative;
    width: 100vw;
    height: 100vh;
`

const LoadingBackground = styled.section`
    position: absolute;
    z-index: 29;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #0B1015;
`

const NotificationsModule = styled(NotificationsView)`
    z-index: 30;
`

const InventoryModule = styled(InventoryView)`
    z-index: 20;
`
const WorldViewModule = styled(WorldView)`
    z-index: 10;
`

const QuestBoardModule = styled(QuestBoardView)`
    z-index: 1;
`

const IdleQuestsView = () => {
    const snd = { 
        state: useSelector((state: IdleQuestsState) => state), 
        dispatch: idleQuestsStore.dispatch 
    }
    const transitions = idleQuestsTransitions(snd)
    useInitEffects(transitions, snd)
    const dragonSilver = 0
    const dragonSilverToClaim = 0
    
    return(
        <IdleQuestsContainer>
            <ConditionalRender condition={snd.state.questBoard.initLoading}>
                <LoadingBackground>
                    <Loading size={8} />
                </LoadingBackground>
            </ConditionalRender>

            <NotificationsModule notifications={snd.state.notifications.notifications} />

            <InventoryModule
                open={snd.state.questBoard.inventoryOpen}
                adventurers={snd.state.questBoard.adventurers}
                adventurerSlots={snd.state.questBoard.adventurerSlots}
                selectedQuest={snd.state.questBoard.selectedQuest}
                takenQuests={snd.state.questBoard.takenQuests}
                selectedAdventurer={snd.state.questBoard.selectedAdventurer}
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                onAdventurerRecruit={transitions.onRecruitAdventurer}
                onItemClick={transitions.onItemClick}
                onClickClose={transitions.onToggleInventory}
            > 
            { snd.state.questBoard.selectedQuest ?
                <QuestSheet
                    quest={snd.state.questBoard.selectedQuest}
                    adventurerSlots={snd.state.questBoard.adventurerSlots}
                    onSign={transitions.onSignQuest}
                    onUnselectAdventurer={transitions.onUnselectAdventurer}
                />
            : snd.state.questBoard.selectedAdventurer ?
                <AdventurerSplashArt
                    adventurer={snd.state.questBoard.selectedAdventurer}
                />
            : <></> } 
            </InventoryModule>

            { snd.state.world.open ?
                <WorldViewModule
                    worldState={snd.state.world}
                    onViewLocationChange={transitions.world.onWorldMapLocationChange}
                />
            : <></> }

            <QuestBoardModule
                availableQuests={snd.state.questBoard.availableQuests}
                onSelectQuest={transitions.onSelectQuest}
                onFetchMoreQuests={transitions.onFetchMoreQuests}
            />

            <AlphaNotes />
        </IdleQuestsContainer>
    )
}

export default IdleQuestsView
