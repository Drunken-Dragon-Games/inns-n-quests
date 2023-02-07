import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"

export default (adventurerId: string) => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const adventurers = generalSelector.idleQuest.questAvailable.data.selectAdventurer.selectAdventurer
    const medal = adventurers.indexOf(adventurerId)

    return medal

}