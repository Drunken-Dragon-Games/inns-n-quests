import { useEffect } from "react"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { getAvailableQuest } from "../features/availableQuest"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

export default () => {

    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const numberOfAvailableQuest = generalSelector.idleQuest.questAvailable.data.quest.availableQuest.length

    useEffect(()=>{
        generalDispatch(getAvailableQuest(true))
    },[])

    useEffect(()=>{

        if(numberOfAvailableQuest < 5){
            generalDispatch(getAvailableQuest())
        }
    },[numberOfAvailableQuest])
}