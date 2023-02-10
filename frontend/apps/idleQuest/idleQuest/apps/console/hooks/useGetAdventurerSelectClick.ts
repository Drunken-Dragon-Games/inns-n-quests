import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { selectAdventurer, unselectAdventurer } from "../../availableQuest/features/quest-board"
import { notEmpty } from "../../../../../utils"
import { Adventurer } from "../../../../dsl"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const selectedAvailableQuest =  generalSelector.idleQuests.questBoard.data.questBoard.selectedAvailableQuest

    const selAdventurer = ( adventurer: Adventurer, unSelect: boolean) =>{

        if(notEmpty(selectedAvailableQuest)){
            if(!unSelect){
                generalDispatch(selectAdventurer(adventurer))
            } else {
                generalDispatch(unselectAdventurer(adventurer))
            }
        }
    }

    return {selAdventurer, isQuestSelected: notEmpty(selectedAvailableQuest) }
}


