import { useGeneralDispatch } from "../../../../../../features/hooks"
import { unselectAdventurer } from "../features/quest-board"

export default () => {
    const generalDispatch = useGeneralDispatch()

    const removeAdventurer = (adventurerId: string ) => {
        console.log(adventurerId)
        generalDispatch(unselectAdventurer(adventurerId))
    }

    return {removeAdventurer}
}