import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { selectAdventurer, unselectAdventurer } from "../../availableQuest/quest-board-state"
import { notEmpty } from "../../../../../utils"
import { Adventurer } from "../../../../dsl"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const selectedAvailableQuest =  generalSelector.idleQuests.questBoard.questBoard.selectedQuest

    const selAdventurer = ( adventurer: Adventurer, selected: boolean) =>{

        if(notEmpty(selectedAvailableQuest)){
            if(selected){
                generalDispatch(unselectAdventurer(adventurer))
            } else {
                generalDispatch(selectAdventurer(adventurer))
            }
        }
    }

    return {selAdventurer, isQuestSelected: notEmpty(selectedAvailableQuest) }
}


