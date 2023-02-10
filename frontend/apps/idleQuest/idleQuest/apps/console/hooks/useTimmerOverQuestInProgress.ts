import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getInProgressQuests } from "../../availableQuest/quest-board-state"

type questStatus = "failed" | "succeeded" | "in_progress" | null

export default (timeLeft: string | number, questStatus: questStatus ) =>{
    const generalDispatch = useGeneralDispatch()

    useEffect(()=>{

        if(timeLeft == "0 hrs" && questStatus == "in_progress"){
            generalDispatch(getInProgressQuests())
        }
        
    },[timeLeft])

}