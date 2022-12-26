import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getAvailableQuest } from "../features/availableQuest"

export default () => {

    const generalDispatch = useGeneralDispatch()

    useEffect(()=>{
        generalDispatch(getAvailableQuest())
    },[])
}