import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { setClearSelectedAdventurers } from "../features/availableQuest"


export default (isReset: boolean) =>{

    const generalDispatch = useGeneralDispatch()

    useEffect(() => {
        
        if(isReset == false){
            generalDispatch(setClearSelectedAdventurers())
        }
        

    }, [isReset])
}