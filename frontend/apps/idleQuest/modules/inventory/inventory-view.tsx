import { ReactNode, useEffect, useRef } from "react"
import { Provider, useSelector } from "react-redux"
import styled, { css, keyframes } from "styled-components"
import _ from "underscore"
import { notEmpty, vmax } from "../../utils"
import ActivityView from "./components/activity"
import InventoryBrowser from "./components/browser"
import InventoryHeader from "./components/header"
import { AdventurerSprite, FurnitureSprite } from "./components/sprites"
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

const ContainerCss = css<{ open: boolean }>`
    position: absolute;
    top: 0;
    height: 100%;
    background-color: rgba(20,20,20,0.5);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const InventoryContainer = styled.div<{ open: boolean }>`
    ${ContainerCss}
    left: 0;
    width: 36vmax;
    backdrop-filter: blur(5px);
`

const ActivityContainer = styled.div<{ open: boolean }>`
    ${ContainerCss}
    right: 0;
    padding: 2vw;
    width: 64vw;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
`

const Header = styled(InventoryHeader)`
    height: 5%;
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
            {draggingState?.item.ctype === "adventurer" && !draggingState.hide ?
                <AdventurerSprite
                    adventurer={draggingState.item}
                    units={vmax(0.8)}
                    render={"hovered"}
                />
            : draggingState?.item.ctype === "furniture" && !draggingState.hide ?
                <FurnitureSprite
                    furniture={draggingState.item}
                    units={vmax(0.8)}
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

    /** Initial load of adventurers, quests in progress, and tracking init. */ 
    useEffect(() => {
        InventoryTransitions.onRefreshInventory()
        const interval = InventoryTransitions.trackInventoryState()
        return () => clearInterval(interval)
    }, [])

    return { open, selection, inventoryContainerRef }
}

const Inventory = ({ className }: { className?: string }) => {
    const state = useInventoryState()
    console.log("render inventory")
    return <WithDraggingItem>
        <InventoryContainer className={className} open={state.open} ref={state.inventoryContainerRef}>
            <Header />
            <InventoryBrowser />
        </InventoryContainer>
        <ActivityContainer className={className} open={state.open && notEmpty(state.selection)} onClick={InventoryTransitions.closeActivity}>
            <ActivityView />
        </ActivityContainer>
    </WithDraggingItem>
}

const InventoryView = ({ className }: { className?: string }) => 
    <Provider store={inventoryStore}>
        <Inventory className={className} />
    </Provider>

export default InventoryView
