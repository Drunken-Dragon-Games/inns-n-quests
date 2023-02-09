import styled from "styled-components"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { QuestPaperInprogress } from "./components/complex"
import { ConditionalRender } from "../../../../utils/components/basic_components"

const ShadowWrapperAnimation = styled.section<{ display: boolean }>`
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    width: 85%;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0,0,0, 0.8);
    visibility: ${props => props.display == true  ?  "visible " : "hidden"};
    opacity: ${props => props.display == true  ?  "1" : "0"};
    transition: opacity 1s, visibility 0.8s;
`

const InProgressQuest = (): JSX.Element => {
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const pageSelected = generalSelector.idleQuest.navigationConsole.page
    const inProgressQuest = generalSelector.idleQuest.navigator.inProgress.inProgressQuest
    return(
        <ShadowWrapperAnimation display= {pageSelected == "in_progress"}>
            <ConditionalRender condition={inProgressQuest != null}>
                <QuestPaperInprogress/>
            </ConditionalRender>
        </ShadowWrapperAnimation>
    ) 
}

export default InProgressQuest