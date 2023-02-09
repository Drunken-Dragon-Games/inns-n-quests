import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { clearSelectedAdventurers } from "../features/quest-board"


export default (isReset: boolean) =>{

    const generalDispatch = useGeneralDispatch()

    useEffect(() => {
        
        if(isReset == true){
            generalDispatch(clearSelectedAdventurers())
        }
        

    }, [isReset])
}