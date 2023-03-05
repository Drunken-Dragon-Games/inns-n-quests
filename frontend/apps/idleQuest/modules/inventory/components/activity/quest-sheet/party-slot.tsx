import { MouseEventHandler, useMemo, useState } from "react"
import styled from "styled-components"
import { Character } from "../../../../../common"
import { notEmpty, PixelArtImage, useDrag, vh, vh1 } from "../../../../../utils"
import InventoryTransitions from "../../../inventory-transitions"
import CharacterMini from "./character-mini"

const CharacterSlotContainer = styled.div<{ interactuable: boolean }>`
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

const CharacterMiniWrapper = styled.div`
    position: absolute;
    top: 0;
`

const EmptySlot = () =>
    <PixelArtImage
        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/dropbox.png"
        alt="character slot in quest"
        width={3}
        height={3}
        units={vh1}
        absolute
    />

type CharacterSlotState = {
    hovering: boolean
    interactuable: boolean
    displayedEmoji: string | undefined
    render: "normal" | "hovered"
}

type CharacterSlotCallbacks = {
    onMouseOver: MouseEventHandler
    onMouseLeave: MouseEventHandler
    onMouseUp: MouseEventHandler
    onMouseDown: MouseEventHandler
}

const useCharacterSlotState = (props: CharacterSlotProps): CharacterSlotState & CharacterSlotCallbacks => {

    const [hovering, setHovering] = useState<boolean>(false)

    const renderState = useMemo<CharacterSlotState>(() => ({
        interactuable: !props.preview && notEmpty(props.character),
        displayedEmoji: props.preview ? undefined : notEmpty(props.character) && hovering ? "cross" : props.emoji,
        render: props.preview || notEmpty(props.character) && hovering ? "hovered" : "normal",
        hovering
    }), [props.character, props.preview, hovering])

    const { dragging, startDrag } = useDrag({
        onDrag: (position) =>
            renderState.interactuable && InventoryTransitions.setDraggingState({ item: props.character!, position }),
        onDrop: () =>
            InventoryTransitions.onItemDragEnded(),
        effectiveDraggingVectorMagnitude: 30,
    })

    const callbacks = useMemo<CharacterSlotCallbacks>(() => ({
        onMouseOver: () => { setHovering(true) },
        onMouseLeave: () => { setHovering(false); dragging && InventoryTransitions.removeCharacterFromParty(props.character) },
        onMouseUp: () => renderState.interactuable && InventoryTransitions.removeCharacterFromParty(props.character),
        onMouseDown: (event) => {
            if (renderState.interactuable) { startDrag(event) }
        },
    }), [props.character, renderState.interactuable, dragging])

    return { ...renderState, ...callbacks }
}

interface CharacterSlotProps {
    character: Character | null
    emoji?: string
    preview?: boolean
}

const PartySlot = ({ character, emoji, preview }: CharacterSlotProps) => {
    const state = useCharacterSlotState({ character, emoji, preview })
    return (
        <CharacterSlotContainer
            onMouseOver={state.onMouseOver}
            onMouseLeave={state.onMouseLeave}
            onMouseUp={state.onMouseUp}
            onMouseDown={state.onMouseDown}
            interactuable={state.interactuable}
        >
            <EmptySlot />
            { notEmpty(character) ? 
                <CharacterMiniWrapper>
                    <CharacterMini
                        character={character}
                        emoji={state.displayedEmoji}
                        render={state.render}
                        displayAPS={true}
                        units={vh(1.7)}
                    />
                </CharacterMiniWrapper>
            : <></> }
        </CharacterSlotContainer>
    )
}

export default PartySlot
