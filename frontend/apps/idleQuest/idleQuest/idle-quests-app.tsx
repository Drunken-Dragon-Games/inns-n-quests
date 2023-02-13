import styled from "styled-components"
import Console from "./apps/console/console"
import QuestBoard from "./apps/availableQuest/quest-board"
import { ErrorHandler } from "./utils/components/complex"
import { Loading } from "../../utils/components/basic_components"
import { ConditionalRender } from "../../explorerOfThiolden/explorerOfThioldenPage/components/basic_components"
import { useGeneralDispatch, useGeneralSelector } from "../../../features/hooks"
import { selectGeneralReducer } from "../../../features/generalReducer"
import { Adventurer, SelectedQuest, TakenQuest } from "../dsl"
import { useEffect, useState } from "react"
import { selectQuest, removeAvailableQuest, unselectQuest, clearAvailableQuests, unselectAdventurer, selectAdventurer } from "./apps/availableQuest/quest-board-state"
import { takeAvailableQuest, claimTakenQuest, getAvailableQuests, getAdventurers, getInProgressQuests } from "./apps/availableQuest/quest-board-thunks"
import { fetchMintTest } from "./apps/availableQuest/faucet"
import { getDragonSilver, getDragonSilverToClaim } from "./apps/console/features/player"

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
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const getAdventurersStatus = generalSelector.idleQuests.questBoard.status.getAdventurersStatus.status
    const getAvailableQuestStatus = generalSelector.idleQuests.questBoard.status.getAvailableQuestStatus.status
    const getInProgressQuestStatus = generalSelector.idleQuests.questBoard.status.inProgress.status
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
    const dragonSilver = generalSelector.idleQuests.player.data.dragonSilver
    const dragonSilverToClaim = generalSelector.idleQuests.player.data.dragonSilverToClaim

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
    const onSelectTakenQuest = (takenQuest: TakenQuest) =>
        generalDispatch(selectQuest(takenQuest))
    const onRecruitAdventurer = () => 
        generalDispatch(fetchMintTest())
    
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
    useEffect(()=>{
        generalDispatch(getDragonSilver())
        generalDispatch(getDragonSilverToClaim())
    },[])
    
    return(
        <Container>
            <ConditionalRender condition={loading}>
                <BackGroundPositionAbsolute>
                    <Loading size={8} />
                </BackGroundPositionAbsolute>
            </ConditionalRender>

            <Console
                adventurers={adventurers}
                adventurerSlots={adventurerSlots}
                selectedQuest={selectedQuest}
                takenQuests={takenQuests}
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
                onAdventurerRecruit={onRecruitAdventurer}
                onAdventurerClick={onSelectAdventurer}
                onSelectTakenQuest={onSelectTakenQuest}
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
            <ErrorHandler />
        </Container>
    )
}

export default IdleQuestsApp