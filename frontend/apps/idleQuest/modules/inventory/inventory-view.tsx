import { ReactNode, useEffect, useRef } from "react"
import { Provider, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import _ from "underscore"
import { notEmpty, px } from "../../common"
import ActivityView from "./components/activity"
import InventoryBrowser from "./components/browser"
import { CharacterSprite, FurnitureSprite } from "./components/sprites"
import { ActivitySelection, DropBoxesState, makeDropBox } from "./inventory-dsl"
import { InventoryState, inventoryStore } from "./inventory-state"
import InventoryTransitions from "./inventory-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const InventoryContainer = styled.div<{ open: boolean, activityOpen: boolean }>`
    position: absolute;
    height: 100%;
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;

    display: flex;
    width: ${props => props.activityOpen ? "100%" : "500px"};
`

const BrowserContainer = styled.div<{ open: boolean }>`
    width: 500px;
    backdrop-filter: blur(5px);
    background-color: rgba(20,20,20,0.5);
`

const ActivityContainer = styled.div<{ open: boolean }>`
    backdrop-filter: blur(3px);
    flex: 1;
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
    display: ${props => props.open ? "flex" : "none"};

    align-items: center;
    justify-content: center;
    background-color: rgba(20,20,20,0.5);
`

const DraggingItem = styled.div.attrs<{ position?: [number, number] }>( props => ({ 
    style: { 
        top: props.position ? props.position[1] : 0, 
        left: props.position ? props.position[0] : 0 
    }
}))<{ position?: [number, number] }>`
    position: absolute;
    margin-left: -2vmax;
    overflow: show;
    z-index: 100;
    display: ${props => props.position ? "block" : "none"};
`

/** 
 * Note: Inventory components are passed as props (children: ReactNode) to prevent
 * them from being re-rendered when the dragging state changes.
 */
const WithDraggingItem = ({ children }: { children?: ReactNode }) => {
    const draggingState = useSelector((state: InventoryState) => state.draggingState)
    return <>
        <DraggingItem position={draggingState?.position}>
            {draggingState?.item.ctype === "character" && !draggingState.hide ?
                <CharacterSprite
                    character={draggingState.item}
                    units={px(17)}
                    render={"hovered"}
                />
            : draggingState?.item.ctype === "furniture" && !draggingState.hide ?
                <FurnitureSprite
                    furniture={draggingState.item}
                    units={px(15)}
                    render={"hovered"}
                />
            : <></>}
        </DraggingItem>
        {children}
    </>
}

type InventoryComponentState = {
    open: boolean
    selection?: ActivitySelection
    dropBoxesState?: DropBoxesState
    inventoryContainerRef: React.RefObject<HTMLDivElement>
}

const useInventoryState = (): InventoryComponentState => {

    /** InventoryContainer ref to figure out the dropbox for the overworld drag and drop. */
    const inventoryContainerRef = useRef<HTMLDivElement>(null)
    const containerBound = inventoryContainerRef.current?.getBoundingClientRect()

    const { open, selection } = useSelector((state: InventoryState) => ({
        open: state.open,
        selection: state.activitySelection,
        //dropBoxesState: !state.activitySelection && state.open ? state.dropBoxesState : undefined,
    }), _.isEqual)

    /** Register overworld drag and drop dropbox when the inventory is open and there is no active activity. */
    useEffect(() => {
        if (!containerBound || !open || selection) return
        const dropBox = makeDropBox(inventoryContainerRef)
        InventoryTransitions.registerDropBoxes("overworld-drop", [{ ...dropBox, left: dropBox.right, right: Number.MAX_SAFE_INTEGER }])
        return InventoryTransitions.deregisterDropBoxes
    }, [inventoryContainerRef.current, containerBound?.top, containerBound?.left, containerBound?.bottom, containerBound?.right, open, selection])

    /** Initial load of characters, quests in progress, and tracking init. */ 
    useEffect(() => {
        InventoryTransitions.onRefreshInventory()
        const interval = InventoryTransitions.trackInventoryState()
        return () => clearInterval(interval)
    }, [])

    return { open, selection, inventoryContainerRef }
}

const Inventory = ({ className }: { className?: string }) => {
    const state = useInventoryState()
    return <WithDraggingItem>
        <InventoryContainer className={className} open={state.open} activityOpen={state.open && notEmpty(state.selection)}>
            <BrowserContainer className={className} open={state.open} ref={state.inventoryContainerRef}>
                <InventoryBrowser />
            </BrowserContainer>
            <ActivityContainer className={className} open={state.open && notEmpty(state.selection)} onClick={InventoryTransitions.closeActivity}>
                <ActivityView />
            </ActivityContainer>
        </InventoryContainer>
    </WithDraggingItem>
}

const InventoryView = ({ className }: { className?: string }) => 
    <Provider store={inventoryStore}>
        <Inventory className={className} />
    </Provider>

export default InventoryView
