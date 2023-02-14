import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { ConditionalRender, Loading } from "../utils/components/basic_components"
import ErrorHandler from "./components/error-handler"
import Console from "./components/inventory/inventory"
import QuestBoard from "./components/quest-board"
import { Adventurer, SelectedQuest, TakenQuest } from "./dsl"
import {
    clearAvailableQuests, IdleQuestsDispatch, IdleQuestsState, removeAvailableQuest, selectAdventurer,
    selectQuest, unselectAdventurer, unselectQuest
} from "./idle-quests-state"
import {
    claimTakenQuest, fetchMintTest, getAdventurers, getAvailableQuests,
    getInProgressQuests, takeAvailableQuest
} from "./idle-quests-transitions"

const Container = styled.section`
    position: relative;
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

const useLoading = (): boolean => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const questBoardStatus = useSelector((state: IdleQuestsState) => state.status)
    const getAdventurersStatus = questBoardStatus.getAdventurersStatus.status
    const getAvailableQuestStatus = questBoardStatus.getAvailableQuestStatus.status
    const getInProgressQuestStatus = questBoardStatus.inProgress.status
    useEffect(()=>{
        if((getAdventurersStatus === 'fulfilled' ||getAdventurersStatus === 'rejected') && 
        (getAvailableQuestStatus === 'fulfilled' || getAvailableQuestStatus === 'rejected') &&
        (getInProgressQuestStatus === 'fulfilled' || getInProgressQuestStatus === 'rejected')){
            setTimeout(() => setIsLoading(false), 500)
        }
    },[getAdventurersStatus, 
        getAvailableQuestStatus, 
        getInProgressQuestStatus ])
    return isLoading
}

const IdleQuestsView = () => {

    const loading = useLoading()
    //const setRefresh = useRefreshQuest()
    const questBoardState = useSelector((state: IdleQuestsState) => state.questBoard)
    const dispatch = useDispatch<IdleQuestsDispatch>()    
    
    const dragonSilver = 0
    const dragonSilverToClaim = 0

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
    const onRecruitAdventurer = () => 
        dispatch(fetchMintTest())
    
    // Ensures there is always at least 5 quests available
    useEffect(()=>{
        if(questBoardState.availableQuests.length < 5){
            dispatch(getAvailableQuests())
        }
    },[questBoardState.availableQuests.length])
    useEffect(()=>{
        dispatch(getAdventurers())
        dispatch(getInProgressQuests())
    },[])
    
    return(
        <Container>
            <ConditionalRender condition={loading}>
                <BackGroundPositionAbsolute>
                    <Loading size={8} />
                </BackGroundPositionAbsolute>
            </ConditionalRender>

            <Console
                adventurers={questBoardState.inventory}
                adventurerSlots={questBoardState.adventurerSlots}
                selectedQuest={questBoardState.selectedQuest}
                takenQuests={questBoardState.takenQuests}
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                onAdventurerRecruit={onRecruitAdventurer}
                onAdventurerClick={onSelectAdventurer}
                onSelectTakenQuest={onSelectTakenQuest}
            />
            <QuestBoard
                availableQuests={questBoardState.availableQuests}
                selectedQuest={questBoardState.selectedQuest}
                adventurerSlots={questBoardState.adventurerSlots}
                onSignQuest={onSignQuest}
                onCloseQuest={onCloseAvailableQuest}
                onSelectQuest={onSelectQuest}
                onFetchMoreQuests={onFetchMoreQuests}
                onUnselectAdventurer={onUnselectAdventurer}
            />
            <ErrorHandler />
        </Container>
    )
}

export default IdleQuestsView
