import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { ConditionalRender, Loading } from "../utils/components/basic_components"
import Inventory from "./components/inventory/inventory"
import { Notifications } from "./components/notifications"
import QuestBoard from "./components/quest-board"
import QuestCard from "./components/quest-board/quest-card"
import { Adventurer, SelectedQuest, TakenQuest } from "./dsl"
import { InventoryItem } from "./dsl/inventory"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import {
    clearAvailableQuests, IdleQuestsDispatch, IdleQuestsState, removeAvailableQuest, removeTimedOutNotifications, selectAdventurer,
    selectQuest, unselectAdventurer, unselectQuest
} from "./idle-quests-state"
import {
    claimTakenQuest, fetchMintTest, getAdventurers, getAvailableQuests,
    getInProgressQuests, takeAvailableQuest
} from "./idle-quests-transitions"
import { useClockSeconds } from "./utils"

const IdleQuestsContainer = styled.section`
    position: relative;
    overflow: hidden;
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

    const globalState = useSelector((state: IdleQuestsState) => state)
    const questBoardState = globalState.questBoard
    const dispatch = useDispatch<IdleQuestsDispatch>()    
    
    const dragonSilver = 0
    const dragonSilverToClaim = 0

    const notifications = useSelector((state: IdleQuestsState) => state.notifications.notifications)

    const onSelectQuest = (quest: SelectedQuest) => 
        dispatch(selectQuest(quest))
    const onSignQuest = (quest: SelectedQuest, adventurers: Adventurer[]) => {
        if (quest.ctype == "available-quest") {
            dispatch(takeAvailableQuest(quest, adventurers))
            dispatch(removeAvailableQuest(quest))
        } else {
            dispatch(claimTakenQuest(quest, adventurers))
        }
    }
    const onCloseAvailableQuest = () => 
        dispatch(unselectQuest())
    const onFetchMoreQuests = () => 
        dispatch(clearAvailableQuests())
    const onUnselectAdventurer = (adventurer: Adventurer) =>
        dispatch(unselectAdventurer(adventurer))
    const onSelectAdventurer = (adventurer: Adventurer) => 
        dispatch(selectAdventurer(adventurer))
    const onSelectTakenQuest = (takenQuest: TakenQuest) =>
        dispatch(selectQuest(takenQuest))
    const onItemClick = (item: InventoryItem) =>
        item.ctype == "adventurer" ? onSelectAdventurer(item) : onSelectTakenQuest(item)
    const onRecruitAdventurer = () => 
        dispatch(fetchMintTest())
    
    useIdleQuestsKeyMap(globalState)
    // Ensures there is always at least 5 quests available
    useEffect(()=>{
        if(questBoardState.availableQuests.length < 5){
            dispatch(getAvailableQuests())
        }
    },[questBoardState.availableQuests.length])
    // Initial load of adventurers and quests in progress
    useEffect(()=>{
        dispatch(getAdventurers(true))
        dispatch(getInProgressQuests())
    },[])
    // Continuous clock
    useClockSeconds((now) => {
        dispatch(removeTimedOutNotifications(now))
    })
    
    return(
        <IdleQuestsContainer>
            <ConditionalRender condition={questBoardState.initLoading}>
                <BackGroundPositionAbsolute>
                    <Loading size={8} />
                </BackGroundPositionAbsolute>
            </ConditionalRender>

            <Notifications notifications={notifications} />
            <Inventory
                open={questBoardState.inventoryOpen}
                adventurers={questBoardState.adventurers}
                adventurerSlots={questBoardState.adventurerSlots}
                selectedQuest={questBoardState.selectedQuest}
                takenQuests={questBoardState.takenQuests}
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                onAdventurerRecruit={onRecruitAdventurer}
                onAdventurerClick={onSelectAdventurer}
                onSelectTakenQuest={onSelectTakenQuest}
                onItemClick={onItemClick}
            />
            <QuestBoard
                availableQuests={questBoardState.availableQuests}
                onSelectQuest={onSelectQuest}
                onFetchMoreQuests={onFetchMoreQuests}
            />
            <QuestCard
                quest={questBoardState.selectedQuest}
                adventurerSlots={questBoardState.adventurerSlots}
                onSign={onSignQuest}
                onClose={onCloseAvailableQuest}
                onUnselectAdventurer={onUnselectAdventurer}
            />
        </IdleQuestsContainer>
    )
}

export default IdleQuestsView
