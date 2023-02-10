import { ConditionalRender } from "../../../../../../utils/components/basic_components"
import { AdventuresMapping, InProgressQuestMapping } from "."
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useGetAdventurers, useGetQuestsInProgress } from "../../hooks"
import { Adventurer } from "../../../../../dsl"

interface PagesProps {
    adventurers: Adventurer[],
    adventurerSlots: (Adventurer | null)[],
    onAdventurerClick: (adventurer: Adventurer) => void
}

const Pages = ({ adventurers, adventurerSlots, onAdventurerClick }: PagesProps) => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const page = generalSelector.idleQuests.navigationConsole.page

    return(<>
    
        <ConditionalRender condition={ page == "available" }>
            <AdventuresMapping/>
        </ConditionalRender>

        <ConditionalRender condition={ page == "in_progress"}>
            <InProgressQuestMapping/>
        </ConditionalRender>
    </>)
}

export default Pages