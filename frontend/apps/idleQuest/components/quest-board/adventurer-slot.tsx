import styled from "styled-components"
import { useState } from "react"
import { PixelArtImage, notEmpty } from "../../../utils"
import { Adventurer } from "../../dsl"
import AdventurerCard from "../adventurer-card/adventurer-card"

const AdventurerSlotContainer = styled.div<{ interactuable: boolean }>`
    width: 100%;
    min-height: 11.6vmax;
    max-width: 7.25vmax;
    display: flex;
    align-items: center;
    justify-content: center;
    ${props => props.interactuable ? `cursor: pointer;` : ``}
`

const EmptySlot = () =>
    <PixelArtImage
        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/dropbox.png"
        alt="adventurer slot in quest"
        width={2.3}
        height={2.3}
        absolute
    />

interface AdventurerSlotProps {
    className?: string,
    adventurer: Adventurer | null,
    emoji?: string,
    onUnselectAdventurer?: (adventurer: Adventurer) => void
}

const AdventurerSlot = ({ className, adventurer, emoji, onUnselectAdventurer }: AdventurerSlotProps) => {
    const [hovering, setHovering] = useState<boolean>(false)
    const interactuable = notEmpty(onUnselectAdventurer) && notEmpty(adventurer)
    const displayedEmoji = interactuable && hovering ? "cross" : emoji
    const render = interactuable && hovering ? "hovered" : "normal"
    return (
        <AdventurerSlotContainer
            className={className}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => interactuable ? onUnselectAdventurer(adventurer) : null}
            interactuable={interactuable}
        >
            <EmptySlot />
            {notEmpty(adventurer) ?
                <AdventurerCard
                    adventurer={adventurer}
                    emoji={displayedEmoji}
                    render={render}
                    displayAPS={true}
                />
            : <></> }
        </AdventurerSlotContainer>
    )
}

export default AdventurerSlot