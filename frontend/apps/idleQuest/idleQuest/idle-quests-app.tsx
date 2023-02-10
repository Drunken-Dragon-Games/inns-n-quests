import styled from "styled-components"
import Console from "./apps/console/console"
import QuestBoard from "./apps/availableQuest/quest-board"
import InProgressQuest from "./apps/inProgressQuests/inProgressQuest"
import { ErrorHandler } from "./utils/components/complex"
import { useLoading } from "./utils/hooks"
import { Loading } from "../../utils/components/basic_components"
import { ConditionalRender } from "../../explorerOfThiolden/explorerOfThioldenPage/components/basic_components"
import { useGeneralDispatch, useGeneralSelector } from "../../../features/hooks"
import { selectGeneralReducer } from "../../../features/generalReducer"
import { notEmpty } from "../../utils"
import { clearAvailableQuests, getAvailableQuests, removeAvailableQuest, selectAvailableQuest, takeAvailableQuest, unselectAdventurer, unselectAvailableQuest } from "./apps/availableQuest/features/quest-board"
import { Adventurer, AvailableQuest } from "../dsl"
import { useEffect } from "react"

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
    
    const selectedAvailableQuest = generalSelector.idleQuests.questBoard.data.questBoard.selectedAvailableQuest
    const adventurerSlots = generalSelector.idleQuests.questBoard.data.questBoard.adventurerSlots
    const availableQuests = generalSelector.idleQuests.questBoard.data.questBoard.availableQuests

    const onSelectQuest = (quest: AvailableQuest) => 
        generalDispatch(selectAvailableQuest(quest))
    const onSignAvailableQuest = () => {
        if (notEmpty(selectedAvailableQuest)) {
            generalDispatch(takeAvailableQuest(selectedAvailableQuest.questId, adventurerSlots.filter(notEmpty)))
            generalDispatch(removeAvailableQuest(selectedAvailableQuest))
        }
    }
    const onCloseAvailableQuest = () => 
        generalDispatch(unselectAvailableQuest())
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
                    onSignQuest={onSignAvailableQuest}
                    onCloseQuest={onCloseAvailableQuest}
                    onSelectQuest={onSelectQuest}
                    onFetchMoreQuests={onFetchMoreQuests}
                    onUnselectAdventurer={onUnselectAdventurer}
                />
                <InProgressQuest />
            </Flex>
        </Relative>
        <ErrorHandler />
    </>)
}

export default IdleQuestsApp