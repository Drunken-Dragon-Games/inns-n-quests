import { useGeneralDispatch, useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { setSelectAdventurerDrag, setSelectAdventurerClick, setUnselectAdventurerClick } from "../../availableQuest/features/availableQuest"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const isQuestSelected =  generalSelector.idleQuest.navigator.availableQuest.availableQuest != null 

    const selectAdventurer = ( id: string , unSelect: boolean) =>{

        if(isQuestSelected){
            if(!unSelect){
                let maxLength = getSlotsNumber()
                if(maxLength)
                    generalDispatch(setSelectAdventurerClick({id, maxLength }))
            } else {
                generalDispatch(setUnselectAdventurerClick(id))
            }
        }
    }


    const getSlotsNumber = () => {
        const questNumber = generalSelector.idleQuest.navigator.availableQuest.availableQuest
        const quests = generalSelector.idleQuest.questAvailable.data.quest.shownQuest
        if(questNumber != null){
          return quests[questNumber].slots
        }
    }

    return {selectAdventurer, isQuestSelected }
    
}


