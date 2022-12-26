import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getInProgressQuest } from "../../inProgressQuests/features/inProgressQuest"

type questStatus = "failed" | "succeeded" | "in_progress" | null

export default (timeLeft: string | number, questStatus: questStatus ) =>{
    const generalDispatch = useGeneralDispatch()

    useEffect(()=>{

          
        if(timeLeft == "0" && questStatus == "in_progress"){
            generalDispatch(getInProgressQuest())
        }
        
    },[timeLeft])

}