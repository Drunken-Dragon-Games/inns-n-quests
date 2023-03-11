import { MouseEventHandler, RefObject, useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import _ from "underscore"
import { Character, notEmpty, PixelArtImage, useDrag, vh, vh1 } from "../../../../../common"
import { DraggableItem, makeDropBox, SelectedQuest } from "../../../inventory-dsl"
import { InventoryState } from "../../../inventory-state"
import InventoryTransitions from "../../../inventory-transitions"
import CharacterMini from "./character-mini"

const PartyContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 1vh;
    flex-direction: row;
    justify-content: center;
`

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
        displayedEmoji: notEmpty(props.character) && hovering && !props.preview ? "cross" : props.emoji,
        render: props.preview || notEmpty(props.character) && hovering ? "hovered" : "normal",
        hovering
    }), [props.character, props.preview, hovering, props.emoji])

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
                        displayAPS={false}
                        units={vh(1.7)}
                    />
                </CharacterMiniWrapper>
            : <></> }
        </CharacterSlotContainer>
    )
}

type PartyViewState = {
    dropBoxRef: RefObject<HTMLDivElement>
    hovering?:Character 
    picked: Character | null
}[]

const usePartyViewState = (quest: SelectedQuest, adventurerSlots: (Character | null)[]): PartyViewState => {
    const boxRef1 = useRef<HTMLDivElement>(null)
    const boxRef2 = useRef<HTMLDivElement>(null)
    const boxRef3 = useRef<HTMLDivElement>(null)
    const boxRef4 = useRef<HTMLDivElement>(null)
    const boxRef5 = useRef<HTMLDivElement>(null)
    const dropBoxesRefs = [boxRef1, boxRef2, boxRef3, boxRef4, boxRef5]
    const box1Bound = boxRef1.current?.getBoundingClientRect()

    useEffect(() => {
        if (quest.ctype === "taken-staking-quest" || dropBoxesRefs.every(ref => ref.current == null)) return
        InventoryTransitions.registerDropBoxes("party-pick", dropBoxesRefs.map(makeDropBox))
        return InventoryTransitions.deregisterDropBoxes
    }, [boxRef1.current, boxRef2.current, boxRef3.current, boxRef4.current, boxRef5.current, quest,
        box1Bound?.left, box1Bound?.top, box1Bound?.bottom, box1Bound?.right, 
    ])

    const dropBoxesState = useSelector((state: InventoryState) => state.dropBoxesState, _.isEqual)

    const slotsState = useMemo<PartyViewState>(() => 
        dropBoxesRefs.map((dropBoxRef, index) => {
            const hovering: DraggableItem | undefined = dropBoxesState?.dropBoxes[index]?.hovering
            return {
                dropBoxRef,
                hovering: hovering?.ctype == "character" ? hovering : undefined,
                picked: adventurerSlots[index]
            }
        })
    , [dropBoxesState, adventurerSlots, quest])

    return slotsState
    /*
    return dropBoxesRefs.map((dropBoxRef, index) => {
        return {
            dropBoxRef,
            picked: adventurerSlots[index]
        }
    })
    */
}

const PartyView = ({ quest, adventurerSlots }: { quest: SelectedQuest, adventurerSlots: (Character | null)[] }) => {
    const state = usePartyViewState(quest, adventurerSlots)
    return (
        <PartyContainer>
            {state.map(({ dropBoxRef, picked, hovering }, index) =>
                <div key={"character-slot-" + index} ref={dropBoxRef}>
                    <PartySlot
                        character={hovering ? hovering : picked}
                        preview={notEmpty(hovering) || quest.ctype === "taken-staking-quest"}
                        emoji={
                            quest.ctype === "taken-staking-quest" && quest.outcome ? 
                            quest.outcome.ctype == "failure-outcome" ? "bad" : "good" : undefined}
                    />
                </div>
            )}
        </PartyContainer>
    )
}

export default PartyView
