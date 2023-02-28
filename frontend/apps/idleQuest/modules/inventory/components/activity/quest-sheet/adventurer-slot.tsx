import styled from "styled-components"
import { useMemo, useRef, useState } from "react"
import { Adventurer, If } from "../../../../../common"
import { PixelArtImage, vh1, notEmpty, vh } from "../../../../../utils"
import AdventurerMini from "./adventurer-mini"
import { useInventorySelector } from "../../../inventory-state"
import InventoryTransitions from "../../../inventory-transitions"

const AdventurerSlotContainer = styled.div<{ interactuable: boolean }>`
    position: relative;
    height: 10vh;
    width: 10vh;
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
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

interface AdventurerSlotProps {
    className?: string,
    adventurer: Adventurer | null,
    emoji?: string,
    slotNumber: number,
}

const AdventurerSlot = ({ className, adventurer, emoji, slotNumber }: AdventurerSlotProps) => {
    const [hovering, setHovering] = useState<boolean>(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const draggingRef = useRef<{ adventurer: Adventurer, intersects: boolean} | null>(null)
    const draggingState = useInventorySelector(state => state.draggingState)
    useMemo(() => {
        if (draggingRef.current && !draggingState) {
            if (draggingRef.current.intersects) 
                InventoryTransitions.addAdventurerToParty(draggingRef.current.adventurer, slotNumber)
            draggingRef.current = null
        } else if (containerRef.current && draggingState?.item.ctype === "adventurer") {
            const rect = containerRef.current.getBoundingClientRect()
            const intersects = (
                rect.top < draggingState.position[1] && 
                rect.bottom > draggingState.position[1] &&
                rect.left < draggingState.position[0] &&
                rect.right > draggingState.position[0]
            )
            draggingRef.current = { adventurer: draggingState.item, intersects }
        }
    }, [draggingState])

    const interactuable = notEmpty(adventurer)
    const displayedEmoji = interactuable && hovering ? "cross" : emoji
    const render = interactuable && hovering ? "hovered" : "normal"
    return (
        <AdventurerSlotContainer
            className={className}
            ref={containerRef}
            onMouseOver={() => { 
                setHovering(true) 
            }}
            onMouseLeave={() => {
                setHovering(false)
            }}
            onClick={() => notEmpty(adventurer) && InventoryTransitions.removeAdventurerFromParty(adventurer)}
            interactuable={interactuable}
        >
            <EmptySlot />
            { notEmpty(adventurer) && !draggingRef.current?.intersects ? 
                <AdventurerMiniWrapper>
                    <AdventurerMini
                        adventurer={adventurer}
                        emoji={displayedEmoji}
                        render={render}
                        displayAPS={true}
                        units={vh(1.7)}
                    />
                </AdventurerMiniWrapper>
            : <></> }
            { notEmpty(draggingRef.current) && draggingRef.current.intersects ?
                <AdventurerMiniWrapper>
                    <AdventurerMini
                        adventurer={draggingRef.current.adventurer}
                        render={"disabled"}
                        displayAPS={true}
                        units={vh(1.7)}
                    />
                </AdventurerMiniWrapper>
            : <></> }
        </AdventurerSlotContainer>
    )
}

export default AdventurerSlot