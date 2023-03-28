import { useEffect } from "react"
import { Provider, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import _ from "underscore"
import { notEmpty } from "../../../common"
import ActivityView from "./components/activity"
import InventoryBrowser from "./components/browser"
import { ActivitySelection } from "./inventory-dsl"
import { InventoryState, inventoryStore } from "./inventory-state"
import InventoryTransitions from "./inventory-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = (position: "bottom" | "top") => keyframes`
    0% { opacity: 1; ${position}: 0; }
    99% { ${position}: 0; }
    100% { opacity: 0; ${position}: -100vh; }
`

const InventoryContainer = styled.div<{ open: boolean, activityOpen: boolean }>`
    position: absolute;
    display: flex;
    opacity: ${props => props.open ? "1" : "0"};

    @media (min-width: 1025px) {
        height: 100%;
        width: ${props => props.activityOpen ? "100%" : "40vh"};
        ${props => props.open ? "top: 0;" : "top: -100vh;"};
        animation: ${props => props.open ? openAnimation : closeAnimation("top")} 0.5s ease-in-out;
    }

    @media (max-width: 1024px) {
        bottom: 0;
        width: 100%;
        height: ${props => props.activityOpen ? "100%" : "calc(17vh + 39px)"};
        ${props => props.open ? "bottom: 0;" : "bottom: -100vh;"};
        animation: ${props => props.open ? openAnimation : closeAnimation("bottom")} 0.5s ease-in-out;
        flex-direction: column-reverse;
    }
`

/*
const BrowserContainer = styled.div<{ open: boolean }>`
    background-color: red;
    @media (max-width: 1024px) {
        width: 100%;
    }
`
*/

const ActivityContainer = styled.div<{ open: boolean, backshadow: boolean }>`
    flex: 1;
    display: ${props => props.open ? "flex" : "none"};
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation("top")} 0.5s ease-in-out;

    align-items: center;
    justify-content: center;

    ${props => props.backshadow && `
        backdrop-filter: blur(3px);
        background-color: rgba(20,20,20,0.5);
    `}
`

type InventoryComponentState = {
    open: boolean
    activity?: ActivitySelection
}

const useInventoryState = (): InventoryComponentState => {

    const { open, activity } = useSelector((state: InventoryState) => ({
        open: state.open,
        activity: state.activitySelection,
    }), _.isEqual)

    /** Initial load of characters, quests in progress, and tracking init. */ 
    useEffect(() => {
        InventoryTransitions.onRefreshInventory()
        const interval = InventoryTransitions.trackInventoryState()
        return () => clearInterval(interval)
    }, [])

    return { open, activity }
}

const Inventory = ({ className }: { className?: string }) => {
    const state = useInventoryState()
    return (
        <InventoryContainer className={className} open={state.open} activityOpen={state.open && notEmpty(state.activity)}>
            <InventoryBrowser />
            <ActivityContainer className={className} open={state.open && notEmpty(state.activity)} onClick={InventoryTransitions.closeActivity} backshadow={state.activity?.ctype !== "overworld-dropbox"}>
                <ActivityView activity={state.activity} />
            </ActivityContainer>
        </InventoryContainer>
    )
}

const InventoryView = ({ className }: { className?: string }) => 
    <Provider store={inventoryStore}>
        <Inventory className={className} />
    </Provider>

export default InventoryView
