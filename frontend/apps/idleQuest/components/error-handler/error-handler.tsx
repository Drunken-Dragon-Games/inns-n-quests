import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { IdleQuestsState } from "../../idle-quests-state"
import ErrorHandlerSnackbar from "./error-handler-snackbar"

interface ErrorArray {
    status: string
    message: string
}

const useErrorHandler = () => {
    const [errorsArray, setErrorsArray] = useState<ErrorArray[]>([])

    const questBoardStatus = useSelector((state: IdleQuestsState) => state.status)

    //todos los status de los diferentes fetch 
    const getAdventurersStatus = questBoardStatus.getAdventurersStatus.status
    const getAdventurersError = questBoardStatus.getAdventurersStatus

    const getAvailableQuestStatus = questBoardStatus.getAvailableQuestStatus.status
    const getAvailableQuestError =  questBoardStatus.getAvailableQuestStatus.error
    const takeAvailableQuestStatus = questBoardStatus.takeAvailableQuestStatus.status
    const takeAvailableQuestError = questBoardStatus.takeAvailableQuestStatus.error

    const claimRewardInProgressQuestStatus = questBoardStatus.claimReward.status
    const claimRewardInProgressQuestError = questBoardStatus.claimReward.error
    const getInProgressQuestStatus = questBoardStatus.inProgress.status
    const getInProgressQuestError = questBoardStatus.inProgress.error

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
                    //generalDispatch(setIsAuthenticated("rejected"))
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
                return <ErrorHandlerSnackbar status={elOriginal.status} key={index}>{elOriginal.message}</ErrorHandlerSnackbar>
            })}
        </SnackbarContainer>
    ) 
}

export default ErrorHandler