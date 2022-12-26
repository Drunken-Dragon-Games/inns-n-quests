import { useEffect, useState } from "react"

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
//recibe inProgressQuests y regresa el numero de inProgressQuest que ya estan terminados
export default (inProgressQuests: inProgressQuest [] ) => {
    const [questCompletedNumber, setQuestCompletedNumber] = useState(0)

    useEffect(() => {
        const questCompleted = inProgressQuests.filter(inProgressQuest => inProgressQuest.state != "in_progress" );
        const questCompletedNumber = questCompleted.length
        setQuestCompletedNumber(questCompletedNumber)
    }, [inProgressQuests])
    
    return  questCompletedNumber 
}