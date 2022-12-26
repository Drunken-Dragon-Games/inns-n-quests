import { useEffect, useState } from "react"
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

interface inProgressQuest{
    enrolls: enrolls []
    id: string
    is_claimed: boolean
    player_stake_address: string
    quest: quest
    quest_id: string
    started_on: string
    state: "failed" | "succeeded" | "in_progress" | null
}

interface quest{
    description: string
    difficulty: number
    duration: number
    id: string
    name: string
    rarity: string
    reward_ds: number
    reward_xp: number
    slots: number
}

interface enrolls{
    adventurer: adventurer
    adventurer_id: string
    taken_quest_id: string
}

interface adventurer{
    experience: number
    id: string
    in_quest: boolean
    metadata: metadata
    on_chain_ref: string
    player_stake_address: string
    type: "pixeltile" | "gma"
}

interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
}



const placeHolder : inProgressQuest = {
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
    }
}

export default (): inProgressQuest => {
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const [inProgressQuestData, setInProgressQuestData] = useState<inProgressQuest>(placeHolder)

    const index = generalSelector.idleQuest.navigator.inProgress.inProgressQuest
    const inProgressQuest = generalSelector.idleQuest.questsInProgress.data.inProgressQuest.quests

    useEffect(()=>{
        if(index != null)
            setInProgressQuestData(inProgressQuest[index])
    },[index])

    return inProgressQuestData
}