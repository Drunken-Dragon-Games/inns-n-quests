import { useState, useEffect } from "react"
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

interface availableQuest {
    uiid?: string
    id: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    width?: number
    height?: number
}

const placeHolder: availableQuest ={
    uiid: "123wqe1452662retwqet",
    id: "qwe12342315412352351234",
    name: "placeholder",
    description: "placeholder",
    reward_ds: 23,
    reward_xp: 23,
    difficulty: 1,
    slots: 3,
    rarity: "townsfolk",
    duration: 12312421
}


export default ():availableQuest  =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const questNumber = generalSelector.idleQuest.navigator.availableQuest.availableQuest
    const quests = generalSelector.idleQuest.questAvailable.data.quest.shownQuest

    const [questData, setQuestData] = useState<availableQuest>(placeHolder)

    useEffect(()=>{
        if(questNumber != null){
            setQuestData(quests[questNumber])
        }
    },[questNumber])


    return questData
}
