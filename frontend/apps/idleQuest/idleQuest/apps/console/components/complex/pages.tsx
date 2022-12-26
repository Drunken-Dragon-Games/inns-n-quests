import styled from "styled-components"
import { ConditionalRender } from "../../../../../../utils/components/basic_components"
import { AdventuresMapping, InProgressQuestMapping } from "."
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useGetAdventurers, useGetQuestsInProgress } from "../../hooks"

const Pages = () : JSX.Element => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const page = generalSelector.idleQuest.navigationConsole.page

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