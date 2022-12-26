
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { useState, useEffect } from "react"
import { useKeyPress, useClickInside } from "../../../../../utils/hooks"
import { setAvailableQuestUnselect } from "../../../features/interfaceNavigation"

export default ( clickInRef: any, avoidRef: any): boolean =>{

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()

    const numberOfQuestOpen = generalSelector.idleQuest.navigator.availableQuest.availableQuest
    const pageSelector = generalSelector.idleQuest.navigationConsole.page

    const escapePress = useKeyPress("Escape");

    useClickInside(clickInRef, () => generalDispatch(setAvailableQuestUnselect()) ,avoidRef)
    
    useEffect(() => {
        
        if(numberOfQuestOpen !== null){
            setIsOpen(true)
        } else if(numberOfQuestOpen == null){
            setIsOpen(false)
        }
    }, [numberOfQuestOpen])

    useEffect(() => {
        
        if(escapePress == true){
            generalDispatch(setAvailableQuestUnselect())
        }
    }, [escapePress])

    useEffect(() => {
        
        if(pageSelector =="in_progress"){
            generalDispatch(setAvailableQuestUnselect())
        }
    
    }, [pageSelector])

    return isOpen
    
}