import { useState } from "react"


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

export default (enrols: enrolls []) => {
      
    const adventurerEnrolls = enrols.map( enrol => {
        return enrol.adventurer_id
    })

    return adventurerEnrolls
}