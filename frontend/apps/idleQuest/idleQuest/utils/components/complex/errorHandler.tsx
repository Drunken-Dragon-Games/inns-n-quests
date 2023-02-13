import styled from "styled-components"
import { useEffect, useState } from "react"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { setIsAuthenticated } from "../../../../../login/features/authentication"
import { Snackbar } from "../basic_component" 

interface ErrorArray {
    status: string
    message: string
}

const useErrorHandler = () => {
    const generalDispatch = useGeneralDispatch();
    const [errorsArray, setErrorsArray] = useState<ErrorArray[]>([])

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    //todos los status de los diferentes fetch 
    const getAdventurersStatus = generalSelector.idleQuests.questBoard.status.getAdventurersStatus.status
    const getAdventurersError = generalSelector.idleQuests.questBoard.status.getAdventurersStatus

    const getAvailableQuestStatus = generalSelector.idleQuests.questBoard.status.getAvailableQuestStatus.status
    const getAvailableQuestError =  generalSelector.idleQuests.questBoard.status.getAvailableQuestStatus.error
    const takeAvailableQuestStatus = generalSelector.idleQuests.questBoard.status.takeAvailableQuestStatus.status
    const takeAvailableQuestError = generalSelector.idleQuests.questBoard.status.takeAvailableQuestStatus.error

    const claimRewardInProgressQuestStatus = generalSelector.idleQuests.questBoard.status.claimReward.status
    const claimRewardInProgressQuestError = generalSelector.idleQuests.questBoard.status.claimReward.error
    const getInProgressQuestStatus = generalSelector.idleQuests.questBoard.status.inProgress.status
    const getInProgressQuestError = generalSelector.idleQuests.questBoard.status.inProgress.error

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

const SnackbarContainer = styled.div`
    position: fixed;
    bottom: 0vw;
    left: 90%;
    z-index: 50;
    width: 0vw;
`


const ErrorHandler = () =>{
    const [errorsArray] = useErrorHandler()
    return (
        <SnackbarContainer>
            {errorsArray.map((elOriginal, index) => {
                return <Snackbar status={elOriginal.status} key={index}>{elOriginal.message}</Snackbar>
            })}
        </SnackbarContainer>
    ) 
}

export default ErrorHandler