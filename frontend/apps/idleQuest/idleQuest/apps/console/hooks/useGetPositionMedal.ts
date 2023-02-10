import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { notEmpty } from "../../../../../utils"

export default (adventurerId: string) => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const adventurers = generalSelector.idleQuests.questBoard.data.questBoard.adventurerSlots.filter(notEmpty)
    const medal = adventurers.map(a => a.adventurerId).indexOf(adventurerId)

    return medal

}