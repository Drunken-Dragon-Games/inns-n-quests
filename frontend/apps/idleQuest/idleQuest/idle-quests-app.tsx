import styled from "styled-components"
import Console from "./apps/console/console"
import QuestBoard from "./apps/availableQuest/quest-board"
import { ErrorHandler } from "./utils/components/complex"
import { useLoading } from "./utils/hooks"
import { Loading } from "../../utils/components/basic_components"
import { ConditionalRender } from "../../explorerOfThiolden/explorerOfThioldenPage/components/basic_components"
import { useGeneralDispatch, useGeneralSelector } from "../../../features/hooks"
import { selectGeneralReducer } from "../../../features/generalReducer"
import { clearAvailableQuests, getAvailableQuests, removeAvailableQuest, selectQuest, takeAvailableQuest, unselectAdventurer, unselectQuest } from "./apps/availableQuest/features/quest-board"
import { Adventurer, SelectedQuest } from "../dsl"
import { useEffect } from "react"
import { claimTakenQuest } from "./apps/inProgressQuests/features/inProgressQuest"

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
    
    const selectedAvailableQuest = generalSelector.idleQuests.questBoard.questBoard.selectedQuest
    const adventurerSlots = generalSelector.idleQuests.questBoard.questBoard.adventurerSlots
    const availableQuests = generalSelector.idleQuests.questBoard.questBoard.availableQuests

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
    
    // Ensures there is always at least 5 quests available
    useEffect(()=>{
        if(availableQuests.length < 5){
            generalDispatch(getAvailableQuests())
        }
    },[availableQuests.length])
    
    return(<>
        <ConditionalRender condition={loading}>
            <BackGroundPositionAbsolute>
                <Loading size={8} />
            </BackGroundPositionAbsolute>
        </ConditionalRender>

        <Relative>
            <Flex>
                <Console />
                <QuestBoard
                    availableQuests={availableQuests}
                    selectedQuest={selectedAvailableQuest}
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