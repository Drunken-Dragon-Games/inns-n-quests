import { useGeneralDispatch } from "../../../../../../features/hooks"
import { setUnselectAdventurerClick } from "../features/availableQuest"

export default () => {
    const generalDispatch = useGeneralDispatch()

    const removeAdventurer = (adventurerId: string ) => {
        console.log(adventurerId)
        generalDispatch(setUnselectAdventurerClick(adventurerId))
    }

    return {removeAdventurer}
}