import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { ConditionalRender, Loading } from "../utils/components/basic_components"
import AdventurerCard from "./components/adventurer-card/adventurer-card"
import AdventurerSplashArt from "./components/inventory/adventurer-splash-art"
import Inventory from "./components/inventory/inventory"
import { Notifications } from "./components/notifications"
import QuestBoard from "./components/quest-board"
import QuestCard from "./components/quest-board/quest-card"
import { Adventurer, SelectedQuest, TakenQuest } from "./dsl"
import { InventoryItem } from "./dsl/inventory"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import {
    clearAvailableQuests, IdleQuestsDispatch, IdleQuestsState, removeAvailableQuest, removeTimedOutNotifications, pickAdventurerForQuest,
    selectQuest, toggleInventory, unPickAdventurerForQuest, unselectQuest, selectAdventurer
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

    const onSelectQuest = (quest: SelectedQuest) => {
        dispatch(selectQuest(quest))
        dispatch(toggleInventory())
    }
    
    const onSignQuest = (quest: SelectedQuest, adventurers: Adventurer[]) => {
        if (quest.ctype == "available-quest") {
            dispatch(takeAvailableQuest(quest, adventurers))
            dispatch(removeAvailableQuest(quest))
        } else {
            dispatch(claimTakenQuest(quest, adventurers))
        }
    }

    const onFetchMoreQuests = () => 
        dispatch(clearAvailableQuests())

    const onUnselectAdventurer = (adventurer: Adventurer) =>
        dispatch(unPickAdventurerForQuest(adventurer))

    const onItemClick = (item: InventoryItem) =>
        item.ctype == "adventurer" && 
        questBoardState.selectedQuest && 
        questBoardState.selectedQuest.ctype === "available-quest" ? 
            dispatch(pickAdventurerForQuest(item)) :

        item.ctype == "adventurer" && 
        questBoardState.selectedQuest && 
        questBoardState.selectedQuest.ctype === "taken-quest" ? 
            (() => { 
                dispatch(selectAdventurer(item)); 
                dispatch(unselectQuest()) 
            })():

        item.ctype == "adventurer" && 
        questBoardState.selectedAdventurer && 
        questBoardState.selectedAdventurer.adventurerId === item.adventurerId ?
            dispatch(selectAdventurer(undefined)) :

        item.ctype == "adventurer" && 
        !questBoardState.selectedQuest ?
            dispatch(selectAdventurer(item)) :

        item.ctype == "taken-quest" && 
        questBoardState.selectedQuest && 
        questBoardState.selectedQuest.ctype === "taken-quest" && 
        questBoardState.selectedQuest.takenQuestId === item.takenQuestId ? 
            dispatch(unselectQuest()) :

        item.ctype == "taken-quest" ? 
            (() => { 
                dispatch(selectQuest(item))
                dispatch(selectAdventurer(undefined))
            })():

        null

    const onRecruitAdventurer = () => 
        dispatch(fetchMintTest())
    
    const onToggleInventory = () =>
        dispatch(toggleInventory())
    
    
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
                selectedAdventurer={questBoardState.selectedAdventurer}
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                onAdventurerRecruit={onRecruitAdventurer}
                onItemClick={onItemClick}
                onClickClose={onToggleInventory}
            > { questBoardState.selectedQuest ?
                <QuestCard
                    quest={questBoardState.selectedQuest}
                    adventurerSlots={questBoardState.adventurerSlots}
                    onSign={onSignQuest}
                    onUnselectAdventurer={onUnselectAdventurer}
                />
            : questBoardState.selectedAdventurer ?
                <AdventurerSplashArt
                    adventurer={questBoardState.selectedAdventurer}
                />
            : <></>} </Inventory>

            <QuestBoard
                availableQuests={questBoardState.availableQuests}
                onSelectQuest={onSelectQuest}
                onFetchMoreQuests={onFetchMoreQuests}
            />
        </IdleQuestsContainer>
    )
}

export default IdleQuestsView
