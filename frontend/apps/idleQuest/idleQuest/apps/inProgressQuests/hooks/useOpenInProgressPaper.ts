import { useEffect, useState } from "react"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { setInProgressQuestUnselect } from "../../../features/interfaceNavigation"

export default (): boolean =>{

    const [isClose, setIsClose ] = useState<boolean>(true)
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()
    
    const inProgressSelected = generalSelector.idleQuest.navigator.inProgress.inProgressQuest
    const pageSelected = generalSelector.idleQuest.navigationConsole.page
    


    useEffect(()=>{
        if(isClose == true){
            setIsClose(false)
        } else if(isClose == false){
            setIsClose(true)
            setTimeout(function(){
                setIsClose(false)
            }, 1000);
        }
    },[inProgressSelected])
    

    useEffect(()=>{
        if(pageSelected == "available"){
            setIsClose(true)
            setTimeout(function(){
                generalDispatch(setInProgressQuestUnselect())
            }, 800);
        }
    },[pageSelected])
    

    return isClose
}