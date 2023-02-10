import styled from "styled-components"
import Console from "./apps/console/console"
import QuestBoard from "./apps/availableQuest/quest-board"
import { ErrorHandler } from "./utils/components/complex"
import { useLoading } from "./utils/hooks"
import { Loading } from "../../utils/components/basic_components"
import { ConditionalRender } from "../../explorerOfThiolden/explorerOfThioldenPage/components/basic_components"
import { useGeneralDispatch, useGeneralSelector } from "../../../features/hooks"
import { selectGeneralReducer } from "../../../features/generalReducer"
import { Adventurer, SelectedQuest } from "../dsl"
import { useEffect } from "react"
import { selectQuest, removeAvailableQuest, unselectQuest, clearAvailableQuests, unselectAdventurer, selectAdventurer } from "./apps/availableQuest/quest-board-state"
import { takeAvailableQuest, claimTakenQuest, getAvailableQuests, getAdventurers, getInProgressQuests } from "./apps/availableQuest/quest-board-thunks"

const Relative = styled.section`
  position: relative;
`

const Flex = styled.div`
    display: flex;
`

const BackGroundPositionAbsolute = styled.section`
    position: absolute;
    z-index: 10;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #0B1015;
`

const IdleQuestsApp = () => {

    const loading = useLoading()
    //const setRefresh = useRefreshQuest()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()    
    
    const adventurers = generalSelector.idleQuests.questBoard.questBoard.inventory
    const selectedQuest = generalSelector.idleQuests.questBoard.questBoard.selectedQuest
    const adventurerSlots = generalSelector.idleQuests.questBoard.questBoard.adventurerSlots
    const availableQuests = generalSelector.idleQuests.questBoard.questBoard.availableQuests
    const takenQuests = generalSelector.idleQuests.questBoard.questBoard.takenQuests

    console.log(adventurerSlots)
    const onSelectQuest = (quest: SelectedQuest) => 
        generalDispatch(selectQuest(quest))
    const onSignQuest = (quest: SelectedQuest, adventurers: Adventurer[]) => {
        if (quest.ctype == "available-quest") {
            generalDispatch(takeAvailableQuest(quest, adventurers))
            generalDispatch(removeAvailableQuest(quest))
        } else {
            generalDispatch(claimTakenQuest(quest, adventurers))
        }
    }
    const onCloseAvailableQuest = () => 
        generalDispatch(unselectQuest())
    const onFetchMoreQuests = () => 
        generalDispatch(clearAvailableQuests())
    const onUnselectAdventurer = (adventurer: Adventurer) =>
        generalDispatch(unselectAdventurer(adventurer))
    const onSelectAdventurer = (adventurer: Adventurer) => 
        generalDispatch(selectAdventurer(adventurer))
    
    // Ensures there is always at least 5 quests available
    useEffect(()=>{
        if(availableQuests.length < 5){
            generalDispatch(getAvailableQuests())
        }
    },[availableQuests.length])
    useEffect(()=>{
        generalDispatch(getAdventurers())
        generalDispatch(getInProgressQuests())
    },[])
    
    return(<>
        <ConditionalRender condition={loading}>
            <BackGroundPositionAbsolute>
                <Loading size={8} />
            </BackGroundPositionAbsolute>
        </ConditionalRender>

        <Relative>
            <Flex>
                <Console 
                    adventurers={adventurers} 
                    adventurerSlots={adventurerSlots}
                    onAdventurerClick={onSelectAdventurer}
                    selectedQuest={selectedQuest}
                    takenQuests={takenQuests}
                />
                <QuestBoard
                    availableQuests={availableQuests}
                    selectedQuest={selectedQuest}
                    adventurerSlots={adventurerSlots}
                    onSignQuest={onSignQuest}
                    onCloseQuest={onCloseAvailableQuest}
                    onSelectQuest={onSelectQuest}
                    onFetchMoreQuests={onFetchMoreQuests}
                    onUnselectAdventurer={onUnselectAdventurer}
                />
            </Flex>
        </Relative>
        <ErrorHandler />
    </>)
}

export default IdleQuestsApp