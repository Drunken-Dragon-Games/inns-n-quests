import { useSelector } from "react-redux"
import styled from "styled-components"
import { ConditionalRender, Loading } from "../utils/components/basic_components"
import AlphaNotes from "./alpha-notes"
import { If } from "./common-components"
import { IdleQuestsState, idleQuestsStore } from "./idle-quests-state"
import { idleQuestsTransitions, useInitEffects } from "./idle-quests-transitions"
import { InventoryActivityView, InventoryView } from "./modules/inventory"
import { NotificationsView } from "./modules/notifications"
import { QuestBoardView } from "./modules/quest-board"
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
    const state = useSelector((state: IdleQuestsState) => state)
    const dispatch = idleQuestsStore.dispatch 
    const transitions = idleQuestsTransitions({ state, dispatch })
    useInitEffects(transitions, state)
    const dragonSilver = 0
    const dragonSilverToClaim = 0
    
    return(
        <IdleQuestsContainer>
            <ConditionalRender condition={state.inventory.initLoading}>
                <LoadingBackground>
                    <Loading size={8} />
                </LoadingBackground>
            </ConditionalRender>

            <NotificationsModule notifications={state.notifications.notifications} />

            <InventoryModule
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                inventoryState={state.inventory}
                inventoryTransitions={transitions.inventory}
                onCloseAvailableQuest={transitions.questBoard.onRemoveAvailableQuest}
            > 
                <InventoryActivityView state={state.inventory} transitions={transitions.inventory} />
            </InventoryModule>

            <If $if={state.world.open}>
                <WorldViewModule
                    worldState={state.world}
                    onViewLocationChange={transitions.world.onWorldMapLocationChange}
                />
            </If>

            <QuestBoardModule
                questBoardState={state.questBoard}
                questBoardTransitions={transitions.questBoard}
                onQuestClick={transitions.inventory.onSelectQuest}
            />

            <AlphaNotes />
        </IdleQuestsContainer>
    )
}

export default IdleQuestsView
