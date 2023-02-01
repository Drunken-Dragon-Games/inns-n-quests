import { useEffect, useState } from "react"
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { inProgressQuestType } from "../../../../../../types/idleQuest"


const placeHolder: inProgressQuestType  = {
    enrolls:[],
    id: "asdasdasfgqhwyhhqfadh",
    is_claimed: false,
    player_stake_address: "ASdasdasfafasgsdgsadgsdg",
    quest_id: "124twqrgv3416aregtq",
    started_on: "25/11/22",
    state: "in_progress",
    quest:{
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        difficulty: 3,
        duration: 12351263147,
        id: "qe123qwr123123asd12",
        name: "Kill the wolf",
        rarity: "townsfolk",
        reward_ds: 4,
        reward_xp: 1245,
        slots: 2,
        requirements:{}
    }
}

export default (): inProgressQuestType => {
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const [inProgressQuestData, setInProgressQuestData] = useState<inProgressQuestType>(placeHolder)

    const index = generalSelector.idleQuest.navigator.inProgress.inProgressQuest
    const inProgressQuest = generalSelector.idleQuest.questsInProgress.data.inProgressQuest.quests

    useEffect(()=>{
        if(index != null){
            if(inProgressQuestData.id === 'asdasdasfgqhwyhhqfadh'){
                setInProgressQuestData(inProgressQuest[index])
            } else{
                setTimeout(()=>  setInProgressQuestData(inProgressQuest[index]), 300)
            }
        }
    },[index])


    useEffect(()=>{
        return () => {
            setInProgressQuestData(placeHolder)
        }
    },[])

    return inProgressQuestData
}