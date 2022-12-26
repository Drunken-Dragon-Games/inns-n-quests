import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getInProgressQuest } from "../../inProgressQuests/features/inProgressQuest"


export default () => {
    const generalDispatch = useGeneralDispatch()

    useEffect(()=>{
        generalDispatch(getInProgressQuest())
    },[])
}