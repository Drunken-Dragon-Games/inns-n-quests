import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { AdventurerSprite, FurnitureSprite } from "../../common-components"
import { AvailableQuest } from "../../dsl"
import { vmax } from "../../utils"
import DragonSilverDisplay from "./components/dragon-silver-display"
import InventoryBrowser from "./components/inventory-browser"
import { DraggableItem } from "./inventory-dsl"
import { InventoryState } from "./inventory-state"
import { InventoryTransitions } from "./inventory-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const InventoryContainer = styled.div<{ open: boolean }>`
    position: absolute;
    width: 36vmax;
    height: 100%;
    background-color: rgba(20,20,20,0.5);
    backdrop-filter: blur(5px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const Header = styled(DragonSilverDisplay)`
    height: 5%;
`

const DraggingContainer = styled.div.attrs<{ position?: [number, number] }>( props => ({ 
    style: { 
        top: props.position ? props.position[1] : 0, 
        left: props.position ? props.position[0] : 0 
    }
}))<{ position?: [number, number] }>`
    position: absolute;
    display: ${props => props.position ? "block" : "none"};
`

interface DraggingState {
    item: DraggableItem
    position: [number, number]
}

interface InventoryProps {
    className?: string,
    dragonSilver: number,
    dragonSilverToClaim: number,
    inventoryState: InventoryState,
    inventoryTransitions: InventoryTransitions,
    onCloseAvailableQuest: (availableQuest: AvailableQuest) => void
}

const InventoryView = (props: InventoryProps) => {
    const [draggingState, setDraggingState] = useState<DraggingState | undefined>()
    return (
        <InventoryContainer className={props.className} open={props.inventoryState.open}>
            <Header
                dragonSilver={props.dragonSilver}
                dragonSilverToClaim={props.dragonSilverToClaim}
                onClickClose={props.inventoryTransitions.onToggleInventory}
                onAdventurerRecruit={props.inventoryTransitions.onRecruitAdventurer}
            />

            <InventoryBrowser
                inventoryState={props.inventoryState}
                open={props.inventoryState.open}
                onItemClick={props.inventoryTransitions.onItemClick}
                onItemDrag={(item, position) => {
                    setDraggingState({ item, position })
                    props.inventoryTransitions.onItemDragStarted(item)
                }}
                onItemDragEnd={(item) => {
                    setDraggingState(undefined)
                    props.inventoryTransitions.onItemDragEnded(item)
                }}
            />

            <DraggingContainer position={draggingState?.position}>
                { draggingState && draggingState.item.ctype === "adventurer" ?
                    <AdventurerSprite
                        adventurer={draggingState.item}
                        units={vmax(0.8)}
                    />
                : draggingState && draggingState.item.ctype === "furniture" ?
                    <FurnitureSprite
                        furniture={draggingState.item}
                        units={vmax(0.8)}
                    /> 
                : <></> } 
            </DraggingContainer>
        </InventoryContainer>
    )
}

export default InventoryView
