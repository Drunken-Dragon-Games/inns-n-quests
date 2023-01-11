import { useEffect, useState } from "react"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { setIsAuthenticated } from "../../../../login/features/authentication"

interface errorArray {
    status: string
    message: string
}

export default () =>{
    const generalDispatch = useGeneralDispatch();
    const [errorsArray, setErrorsArray] = useState<errorArray[]>([])

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    //todos los status de los diferentes fetch 
    const getAdventurersStatus = generalSelector.idleQuest.adventurers.getAdventurersStatus.status
    const getAdventurersError = generalSelector.idleQuest.adventurers.getAdventurersStatus.error

    const getAvailableQuestStatus = generalSelector.idleQuest.questAvailable.status.getAvailableQuestStatus.status
    const getAvailableQuestError =  generalSelector.idleQuest.questAvailable.status.getAvailableQuestStatus.error
    const takeAvailableQuestStatus = generalSelector.idleQuest.questAvailable.status.takeAvailableQuestStatus.status
    const takeAvailableQuestError = generalSelector.idleQuest.questAvailable.status.takeAvailableQuestStatus.error

    const claimRewardInProgressQuestStatus = generalSelector.idleQuest.questsInProgress.Status.claimReward.status
    const claimRewardInProgressQuestError = generalSelector.idleQuest.questsInProgress.Status.claimReward.error
    const getInProgressQuestStatus = generalSelector.idleQuest.questsInProgress.Status.inProgress.status
    const getInProgressQuestError = generalSelector.idleQuest.questsInProgress.Status.inProgress.error

    const dragonSilverToClaim = generalSelector.idleQuest.player.status.dragonSilverToClaim.status
    const dragonSilverToClaimError = generalSelector.idleQuest.player.status.dragonSilverToClaim.error


    //detecta cuando el statur ha cambiado y manda un mensaje ya sea error o se logro realizar exitosamente
    useEffect(()=>{
        statusManager(getAdventurersStatus, "", getAdventurersError, "While fetching adventurers:")
    },[getAdventurersStatus])

    useEffect(()=>{
        statusManager(getAvailableQuestStatus, "", getAvailableQuestError,"While fetching available quests:")
    },[getAvailableQuestStatus])

    useEffect(()=>{
        statusManager(claimRewardInProgressQuestStatus, "Reward claimed", claimRewardInProgressQuestError,"While claiming rewards:", true)
    },[claimRewardInProgressQuestStatus])

    useEffect(()=>{
        statusManager(getInProgressQuestStatus, "", getInProgressQuestError,"While fetching in progress:")
    },[getInProgressQuestStatus])

    useEffect(()=>{
        statusManager(dragonSilverToClaim, "", dragonSilverToClaimError, "While claiming dragon silver:")
    },[dragonSilverToClaim])

    useEffect(()=>{
        statusManager(takeAvailableQuestStatus, "Quest accepted", takeAvailableQuestError, "While accepting quest:", true)
    },[takeAvailableQuestStatus])


    //se crea el mensaje necesario
    const statusManager = (status: string, initialMessageSucceded: string, error: any, initialMessageFailed: string, succeded?: boolean) =>{
        
        if(status == "fulfilled" && succeded == true ){
            setErrorsArray(errorsArray.concat({status: "succeded", message: `${initialMessageSucceded}`}))
        } else if (status == "rejected"){

            if(error !== undefined){
                setErrorsArray(errorsArray.concat({status: "rejected", message: ` ${initialMessageFailed} ${error.status} ${error.statusText}`}))
                if(error.status == 401){
                    generalDispatch(setIsAuthenticated("rejected"))
                }
            } else{
                setErrorsArray(errorsArray.concat({status: "rejected", message: `Unknown error`}))

            }
        }
    }

    return[errorsArray]

}