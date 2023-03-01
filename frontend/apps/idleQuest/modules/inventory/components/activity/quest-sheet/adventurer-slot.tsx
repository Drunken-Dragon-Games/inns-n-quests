import { MouseEventHandler, useMemo, useState } from "react"
import styled from "styled-components"
import { Adventurer } from "../../../../../common"
import { notEmpty, PixelArtImage, useDrag, vh, vh1 } from "../../../../../utils"
import InventoryTransitions from "../../../inventory-transitions"
import AdventurerMini from "./adventurer-mini"

const AdventurerSlotContainer = styled.div<{ interactuable: boolean }>`
    position: relative;
    height: 10vh;
    width: 10vh;
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    background-color: rgba(20,20,20,0.1);
    border-radius: 1vh;
    ${props => props.interactuable ? `cursor: pointer;` : ``}
`

const AdventurerMiniWrapper = styled.div`
    position: absolute;
    top: 0;
`

const EmptySlot = () =>
    <PixelArtImage
        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/dropbox.png"
        alt="adventurer slot in quest"
        width={3}
        height={3}
        units={vh1}
        absolute
    />

type AdventurerSlotState = {
    hovering: boolean
    interactuable: boolean
    displayedEmoji: string | undefined
    render: "normal" | "hovered"
}

type AdventurerSlotCallbacks = {
    onMouseOver: MouseEventHandler
    onMouseLeave: MouseEventHandler
    onMouseUp: MouseEventHandler
    onMouseDown: MouseEventHandler
}

const useAdventurerSlotState = (props: AdventurerSlotProps): AdventurerSlotState & AdventurerSlotCallbacks => {

    const [hovering, setHovering] = useState<boolean>(false)

    const renderState = useMemo<AdventurerSlotState>(() => ({
        interactuable: !props.preview && notEmpty(props.adventurer),
        displayedEmoji: props.preview ? undefined : notEmpty(props.adventurer) && hovering ? "cross" : props.emoji,
        render: props.preview || notEmpty(props.adventurer) && hovering ? "hovered" : "normal",
        hovering
    }), [props.adventurer, props.preview, hovering])

    const { dragging, startDrag } = useDrag({
        onDrag: (position) =>
            renderState.interactuable && InventoryTransitions.setDraggingState({ item: props.adventurer!, position }),
        onDrop: () =>
            InventoryTransitions.onItemDragEnded(),
        effectiveDraggingVectorMagnitude: 30,
    })

    const callbacks = useMemo<AdventurerSlotCallbacks>(() => ({
        onMouseOver: () => { setHovering(true) },
        onMouseLeave: () => { setHovering(false); dragging && InventoryTransitions.removeAdventurerFromParty(props.adventurer) },
        onMouseUp: () => renderState.interactuable && InventoryTransitions.removeAdventurerFromParty(props.adventurer),
        onMouseDown: (event) => {
            if (renderState.interactuable) { startDrag(event) }
        },
    }), [props.adventurer, renderState.interactuable, dragging])

    return { ...renderState, ...callbacks }
}

interface AdventurerSlotProps {
    adventurer: Adventurer | null
    emoji?: string
    preview?: boolean
}

const AdventurerSlot = ({ adventurer, emoji, preview }: AdventurerSlotProps) => {
    const state = useAdventurerSlotState({ adventurer, emoji, preview })
    return (
        <AdventurerSlotContainer
            onMouseOver={state.onMouseOver}
            onMouseLeave={state.onMouseLeave}
            onMouseUp={state.onMouseUp}
            onMouseDown={state.onMouseDown}
            interactuable={state.interactuable}
        >
            <EmptySlot />
            { notEmpty(adventurer) ? 
                <AdventurerMiniWrapper>
                    <AdventurerMini
                        adventurer={adventurer}
                        emoji={state.displayedEmoji}
                        render={state.render}
                        displayAPS={true}
                        units={vh(1.7)}
                    />
                </AdventurerMiniWrapper>
            : <></> }
        </AdventurerSlotContainer>
    )
}

export default AdventurerSlot
