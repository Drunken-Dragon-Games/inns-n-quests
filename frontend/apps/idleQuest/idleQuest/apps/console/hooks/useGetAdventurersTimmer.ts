import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getAdventurers } from "../features/adventurers"

export default (timeLeft: number) =>{

    const generalDispatch = useGeneralDispatch()


    useEffect(() => {
    
        if( timeLeft == 0){
                generalDispatch(getAdventurers())
        }

    }, [timeLeft])
}