import { useState, useEffect, SetStateAction } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getAvailableQuests } from "../features/quest-board"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(()=>{

        if(refresh === true){
            generalDispatch(getAvailableQuests(true))
            setTimeout(() => setRefresh(false), 2000)
        }

    },[refresh])

    return setRefresh

}

