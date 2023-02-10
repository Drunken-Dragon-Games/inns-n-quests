import { useEffect, useState } from "react"
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { TakenQuest } from "../../../../dsl"

const placeHolder: TakenQuest  = {
    takenQuestId: "asdasdasfgqhwyhhqfadh",
    userId: "asdasdasfgqhwyhhqfadh",
    adventurerIds: [],
    createdAt: new Date().toISOString(),

    //enrolls:[],
    //id: "asdasdasfgqhwyhhqfadh",
    //is_claimed: false,
    //player_stake_address: "ASdasdasfafasgsdgsadgsdg",
    //quest_id: "124twqrgv3416aregtq",
    //started_on: "25/11/22",
    //state: "in_progress",
    quest:{
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        //difficulty: 3,
        duration: 12351263147,
        questId: "qe123qwr123123asd12",
        location: "Auristar",
        reward: {},
        name: "Kill the wolf",
        //rarity: "townsfolk",
        //reward_ds: 4,
        //reward_xp: 1245,
        slots: 2,
        requirements:{ ctype: "empty-requirement" }
    }
}

export default (): TakenQuest => {
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const [inProgressQuestData, setInProgressQuestData] = useState<TakenQuest>(placeHolder)

    const index = generalSelector.idleQuests.navigator.inProgress.inProgressQuest
    const inProgressQuest = generalSelector.idleQuests.questsInProgress.data.inProgressQuest.quests

    useEffect(()=>{
        if(index != null){
            if(inProgressQuestData.takenQuestId === 'asdasdasfgqhwyhhqfadh'){
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