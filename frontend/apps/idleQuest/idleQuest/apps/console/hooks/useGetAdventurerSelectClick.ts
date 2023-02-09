import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { selectAdventurer, unselectAdventurer } from "../../availableQuest/features/quest-board"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const isQuestSelected =  generalSelector.idleQuest.navigator.availableQuest.availableQuest !== undefined

    const selAdventurer = ( id: string , unSelect: boolean) =>{

        if(isQuestSelected){
            if(!unSelect){
                let maxLength = getSlotsNumber()
                if(maxLength)
                    generalDispatch(selectAdventurer({id, maxLength }))
            } else {
                generalDispatch(unselectAdventurer(id))
            }
        }
    }


    const getSlotsNumber = () => {
        const questNumber = generalSelector.idleQuest.navigator.availableQuest.availableQuest
        if(questNumber != null)
            return questNumber.slots
    }

    return {selAdventurer, isQuestSelected }
    
}


