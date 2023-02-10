import { ConditionalRender } from "../../../../../../utils/components/basic_components"
import { AdventuresMapping, InProgressQuestMapping } from "."
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useGetAdventurers, useGetQuestsInProgress } from "../../hooks"

interface PagesProps {

}

const Pages = () => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const page = generalSelector.idleQuests.navigationConsole.page

    useGetAdventurers()

    useGetQuestsInProgress()

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