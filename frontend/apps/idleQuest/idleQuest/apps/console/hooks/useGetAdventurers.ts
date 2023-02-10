import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getAdventurers } from "../../availableQuest/features/quest-board"

export default () => {

    const generalDispatch = useGeneralDispatch()

    useEffect(()=>{
        generalDispatch(getAdventurers())
    },[])
}