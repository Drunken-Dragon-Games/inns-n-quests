import styled from "styled-components";
import Image from "next/image"
import { useGetAvailableQuest, useRefreshQuest, useResetSelectAdventurers } from "./hooks";
import { QuestBoard, WorldMap, QuestCard } from "./components/complex";
import { RefreshButton } from "./components/basic_components";
import { getAvailableQuests, clearSelectedAdventurers, takeAvailableQuest } from "./features/quest-board";
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks";
import { selectGeneralReducer } from "../../../../../features/generalReducer";
import { setAvailableQuestSelected, setAvailableQuestUnselect } from "../../features/interfaceNavigation";
import { notEmpty } from "../../../../utils";
import { useEffect } from "react";
import { AvailableQuest } from "../../../dsl";

const QuestDashboardContainer =styled.div`
    width: 85%;
    height: 100vh;
    background-color: #523438;
    display: flex;
    position: relative;
    overflow: hidden;
`

const QuestDashboardWrapper = styled.div`
    width: 80vw;
    height: 50vw;
    position: relative;
    margin: auto;
    // background-image: url(./images/dashboard.png);
    background-repeat: no-repeat;
`

const Center = styled.div`
    position: relative;
`

const ImageWrapper = styled.div`
    position: absolute;
    width: 80vw;
    height: inherit;
    top: 1vw;
`

const AvailableQuests = () => {
    //const setRefresh = useRefreshQuest()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()    
    
    const quest = generalSelector.idleQuest.navigator.availableQuest.availableQuest
    const selectedAdventurers = generalSelector.idleQuest.questAvailable.data.selectAdventurer.selectAdventurer.filter(notEmpty)
    const availableQuests = generalSelector.idleQuest.questAvailable.data.quest.availableQuests
    const onSign = () =>
        notEmpty(quest) ? generalDispatch(takeAvailableQuest(quest.questId, selectedAdventurers)) : null
    const onClose = () => 
        generalDispatch(setAvailableQuestUnselect())
    const onAvailableQuestClick = (quest: AvailableQuest) => 
        generalDispatch(setAvailableQuestSelected(quest))
    
    useGetAvailableQuest()
    useEffect(() => {
        generalDispatch(clearSelectedAdventurers())
    }, [quest])

    return (<>
        <QuestDashboardContainer>

            <QuestDashboardWrapper>
                <Center> 
                    <ImageWrapper>
                        <Image 
                            src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp"  
                            alt="dashboard" 
                            width={2100} 
                            height={1250} 
                            layout ="responsive" />
                    </ImageWrapper>
                    <QuestBoard availableQuests={availableQuests} onQuestClick={onAvailableQuestClick}/>
                    <WorldMap/>
                </Center>
                <RefreshButton onClick ={() => generalDispatch(getAvailableQuests(true))} />
            </QuestDashboardWrapper>
                        
            <QuestCard
                quest={quest}
                selectedAdventurers={selectedAdventurers}
                onSign={onSign}
                onClose={onClose}
            />
    
        </QuestDashboardContainer>
    </>)
}

export default AvailableQuests