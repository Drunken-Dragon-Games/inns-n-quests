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
    const getAdventurersStatus = generalSelector.idleQuests.adventurers.getAdventurersStatus.status
    const getAdventurersError = generalSelector.idleQuests.adventurers.getAdventurersStatus.error

    const getAvailableQuestStatus = generalSelector.idleQuests.questBoard.status.getAvailableQuestStatus.status
    const getAvailableQuestError =  generalSelector.idleQuests.questBoard.status.getAvailableQuestStatus.error
    const takeAvailableQuestStatus = generalSelector.idleQuests.questBoard.status.takeAvailableQuestStatus.status
    const takeAvailableQuestError = generalSelector.idleQuests.questBoard.status.takeAvailableQuestStatus.error

    const claimRewardInProgressQuestStatus = generalSelector.idleQuests.questsInProgress.Status.claimReward.status
    const claimRewardInProgressQuestError = generalSelector.idleQuests.questsInProgress.Status.claimReward.error
    const getInProgressQuestStatus = generalSelector.idleQuests.questsInProgress.Status.inProgress.status
    const getInProgressQuestError = generalSelector.idleQuests.questsInProgress.Status.inProgress.error

    const dragonSilverToClaim = generalSelector.idleQuests.player.status.dragonSilverToClaim.status
    const dragonSilverToClaimError = generalSelector.idleQuests.player.status.dragonSilverToClaim.error


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