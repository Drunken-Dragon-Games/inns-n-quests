import { useEffect, useState } from "react"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { setInProgressQuestUnselect } from "../../../features/interfaceNavigation"
import { setFetchPostClaimRewardInProgressQuestStatusIdle, setRewardClaimDefault, setDeleteInProgressQuest } from '../features/inProgressQuest'

export default (questId: string): boolean =>{

    const [isClose, setIsClose ] = useState<boolean>(true)
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()
    
    const isClaim = generalSelector.idleQuest.questsInProgress.data.claimReward.isClaimed
    const isClaimState = generalSelector.idleQuest.questsInProgress.data.claimReward.state


    const inProgressSelected = generalSelector.idleQuest.navigator.inProgress.inProgressQuest
    const pageSelected = generalSelector.idleQuest.navigationConsole.page
    


    useEffect(()=>{
        if(isClose == true){
            setIsClose(false)
        } else if(isClose == false){
            setIsClose(true)
            setTimeout(function(){
                setIsClose(false)
            }, 1000);
        }
    },[inProgressSelected])
    

    useEffect(()=>{
        if(pageSelected == "available"){
            setIsClose(true)
            setTimeout(function(){
                generalDispatch(setInProgressQuestUnselect())
            }, 800);
        }
    },[pageSelected])
    

     useEffect(() => {
            if(isClaim == true){
                   
                if(isClaimState == "failed"){
                    const closePaper = setTimeout(function(){
                        setIsClose(true)
                    }, 5800);
                    
                    const exitInProgress = setTimeout(function(){
                        generalDispatch(setFetchPostClaimRewardInProgressQuestStatusIdle())
                        generalDispatch(setInProgressQuestUnselect())
                        generalDispatch(setDeleteInProgressQuest(questId))
                        generalDispatch(setRewardClaimDefault())
                    }, 6400);
                
                 } else if (isClaimState == "succeeded"){
                     const closePaper = setTimeout(function(){
                         setIsClose(true)
                        }, 5000);
                        
                    const exitInProgress = setTimeout(function(){
                        generalDispatch(setFetchPostClaimRewardInProgressQuestStatusIdle())
                        generalDispatch(setInProgressQuestUnselect())
                        generalDispatch(setDeleteInProgressQuest(questId))
                        generalDispatch(setRewardClaimDefault())
                    }, 5700);
                }
            }
        }, [isClaim])


    return isClose
}