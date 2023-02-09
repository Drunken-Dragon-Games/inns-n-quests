import { useEffect } from "react"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { getAvailableQuests } from "../features/quest-board"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

export default () => {

    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const numberOfAvailableQuest = generalSelector.idleQuest.questAvailable.data.quest.availableQuests.length

    useEffect(()=>{
        generalDispatch(getAvailableQuests(true))
    },[])

    useEffect(()=>{

        if(numberOfAvailableQuest < 5){
            generalDispatch(getAvailableQuests())
        }
    },[numberOfAvailableQuest])
}