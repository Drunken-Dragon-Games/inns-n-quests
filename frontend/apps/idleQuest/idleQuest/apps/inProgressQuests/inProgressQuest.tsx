import styled from "styled-components"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { QuestCard } from "../availableQuest/components/complex"
import { notEmpty } from "../../../../utils"

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
    const pageSelected = generalSelector.idleQuests.navigationConsole.page
    const allAdventurers = generalSelector.idleQuests.adventurers.data.adventurers

    return(
        <ShadowWrapperAnimation display= {pageSelected == "in_progress"}>
        </ShadowWrapperAnimation>
    )
}

export default InProgressQuest