import { useEffect, useState } from "react";
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

export default (index: number): boolean=>{
    const [selected, setSelected] = useState<boolean>(false)

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const inProgressQuestSelected = generalSelector.idleQuest.navigator.inProgress.inProgressQuest

    useEffect(() => {
        
        if(inProgressQuestSelected !== null){
            if(inProgressQuestSelected == index){
                setSelected(true)
            }else{
                setSelected(false)
            }
        }
    
    }, [inProgressQuestSelected])

    return selected
}