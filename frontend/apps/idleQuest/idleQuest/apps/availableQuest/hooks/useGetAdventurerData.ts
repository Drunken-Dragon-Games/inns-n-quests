import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

export default (adventurerId: string | null) => {
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const adventurers = generalSelector.idleQuest.adventurers.data.data

    const dataAdventurer = adventurers.filter( adventurer => adventurerId === adventurer.adventurerId )
    

    return dataAdventurer[0] ?? {}
}