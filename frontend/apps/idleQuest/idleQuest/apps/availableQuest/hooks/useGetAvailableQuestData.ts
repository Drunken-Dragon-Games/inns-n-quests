import { useState, useEffect } from "react"
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { AvailableQuestType } from "../../../../../../types/idleQuest" 


const placeHolder: AvailableQuestType = {
    uiid: "123wqe1452662retwqet",
    id: "qwe12342315412352351234",
    name: "placeholder",
    description: "placeholder",
    reward_ds: 23,
    reward_xp: 23,
    difficulty: 1,
    slots: 3,
    rarity: "townsfolk",
    duration: 12312421,
    requirements: { ctype: "empty-requirement" },
    questId: "quest-id",
    location: "location",
    reward: {},
}


export default ():AvailableQuestType  =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const questNumber = generalSelector.idleQuest.navigator.availableQuest.availableQuest
    
    const quests = generalSelector.idleQuest.questAvailable.data.quest.shownQuest

    const [questData, setQuestData] = useState<AvailableQuestType>(placeHolder)

    useEffect(()=>{
        if(questNumber != null){
            setQuestData(quests[questNumber])
        }
    },[questNumber])


    return questData
}
