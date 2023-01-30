import { useState, useEffect, SetStateAction } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getAvailableQuest } from "../features/availableQuest"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(()=>{

        if(refresh === true){
            generalDispatch(getAvailableQuest(true))
            setTimeout(() => setRefresh(false), 2000)
        }

    },[refresh])

    return setRefresh

}

