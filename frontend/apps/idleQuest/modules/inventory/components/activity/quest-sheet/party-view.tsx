import { MouseEventHandler, RefObject, TouchEventHandler, useState } from "react"
import styled from "styled-components"
import { Character, isCharacter, notEmpty, PixelArtImage, vh, vh1 } from "../../../../../common"
import { DragNDropApi } from "../../../../drag-n-drop"
import { SelectedQuest } from "../../../inventory-dsl"
import InventoryTransitions from "../../../inventory-transitions"
import { CharacterSprite } from "../../sprites"

const PartyContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 1vh;
    flex-direction: row;
    justify-content: center;
`

const PartySlotContainer = styled.div<{ interactuable: boolean }>`
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
    renderCharacter: Character | null
    render: "normal" | "hovered"
    dropbox: RefObject<HTMLDivElement>
}

type CharacterSlotCallbacks = {
    onMouseOver: MouseEventHandler
    onMouseLeave: MouseEventHandler
    onMouseUp: MouseEventHandler
    onMouseDown: MouseEventHandler
    onTouchStart: TouchEventHandler
    onTouchEnd: TouchEventHandler
}

const dragNDropUtility: string = "party-pick"

const useCharacterSlotState = (quest: SelectedQuest, character: Character | null, index: number): CharacterSlotState & CharacterSlotCallbacks => {

    const [hovering, setHovering] = useState<boolean>(false)
    const [draggingOver, setDraggingOver] = useState<Character | null>(null)

    const preview = quest.ctype === "taken-staking-quest"
    const interactuable = !preview && notEmpty(character)
    const displayedEmoji = (
        hovering && interactuable ? "cross" : 
        preview && quest.outcome?.ctype === "failure-outcome" ? "bad" : 
        preview && quest.outcome?.ctype === "success-outcome" ? "good" : 
        undefined)
    const renderCharacter = draggingOver || character
    const render = interactuable && hovering || draggingOver ? "hovered" : "normal"

    const { ref: dropbox, clearDropbox } = DragNDropApi.useDropbox({
        utility: dragNDropUtility,
        onHoveringEnter: (dropbox) =>
            isCharacter(dropbox.hoveringPayload) && setDraggingOver(dropbox.hoveringPayload),
        onHoveringLeave: () => 
            setDraggingOver(null),
        onDropped: (dropbox) => {
            isCharacter(dropbox.droppedPayload) && setDraggingOver(null)
            isCharacter(dropbox.droppedPayload) && InventoryTransitions.addCharacterToParty(dropbox.droppedPayload, index)
        },
    })

    const { startDrag, startDragTouch } = DragNDropApi.useDrag({
        utility: dragNDropUtility,
        payload: character,
        effectiveDraggingVectorMagnitude: 30,
        enabled: interactuable,
        onDragStart: () => {
            clearDropbox()
            InventoryTransitions.removeCharacterFromParty(character)
        },
        draggingView: () => 
            interactuable && <CharacterSprite character={character} render="hovered" units={vh(1.7)} />
    })

    return {
        hovering,
        interactuable,
        displayedEmoji,
        renderCharacter,
        render,
        dropbox,
        onMouseOver: () => notEmpty(character) && setHovering(true),
        onMouseLeave: () => notEmpty(character) && setHovering(false),
        onMouseUp: () => interactuable && InventoryTransitions.removeCharacterFromParty(character),
        onMouseDown: startDrag,
        onTouchStart: startDragTouch,
        onTouchEnd: () => interactuable && InventoryTransitions.removeCharacterFromParty(character),
    }
}

const PartySlot = ({ quest, character, index }: { quest: SelectedQuest, character: Character | null, index: number }) => {
    const state = useCharacterSlotState(quest, character, index)
    return (
        <PartySlotContainer
            ref={state.dropbox}
            onMouseOver={state.onMouseOver}
            onMouseLeave={state.onMouseLeave}
            onMouseUp={state.onMouseUp}
            onMouseDown={state.onMouseDown}
            onTouchStart={state.onTouchStart}
            onTouchEnd={state.onTouchEnd}
            interactuable={state.interactuable}
        >
            <EmptySlot />
            { notEmpty(state.renderCharacter) && 
                <CharacterMiniWrapper>
                    <CharacterSprite
                        character={state.renderCharacter}
                        render={state.render}
                        emoji={state.displayedEmoji}
                        units={vh(1.7)}
                    />
                </CharacterMiniWrapper>
            }
        </PartySlotContainer>
    )
}

const PartyView = ({ quest, adventurerSlots }: { quest: SelectedQuest, adventurerSlots: (Character | null)[] }) => 
    <PartyContainer>
        {adventurerSlots.map((adventurerSlot, index) =>
            <PartySlot
                character={adventurerSlot}
                quest={quest}
                index={index}
                key={index}
            />
        )}
    </PartyContainer>

export default PartyView
