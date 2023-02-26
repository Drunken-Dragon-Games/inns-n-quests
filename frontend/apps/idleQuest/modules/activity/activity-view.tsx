import styled, { keyframes } from "styled-components"
import AdventurerSplashArt from "../../common-components/adventurer-splash-art"
import { QuestSheet } from "../../common-components/quest-sheet"
import { notEmpty } from "../../utils"
import { InventoryState } from "../inventory/inventory-state"
import { InventoryTransitions } from "../inventory/inventory-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const ActivityContainer = styled.div<{ open: boolean }>`
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(20,20,20,0.5);
    padding: 2vw;
    height: 100%;
    width: 64vw;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const Activity = ({ state, transitions }: ActivityViewProps) => {
    if (state.selection && (state.selection.ctype === "taken-quest" || state.selection.ctype === "available-quest"))
        return <QuestSheet
            quest={state.selection}
            adventurerSlots={state.selectedParty}
            onSign={transitions.onSignQuest}
            onUnselectAdventurer={transitions.onUnselectAdventurer}
        />

    else if (state.selection?.ctype === "adventurer")
        return <AdventurerSplashArt adventurer={state.selection} />

    else return <></>
}

interface ActivityViewProps {
    className?: string
    state: InventoryState
    transitions: InventoryTransitions
}

const ActivityView = (props: ActivityViewProps) => 
    <ActivityContainer className={props.className} open={notEmpty(props.state.selection) && props.state.open}>
        <Activity 
            state={props.state}
            transitions={props.transitions}
        />
    </ActivityContainer>

export default ActivityView