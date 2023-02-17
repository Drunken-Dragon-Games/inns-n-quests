import styled from "styled-components"
import { useState } from "react"
import { notEmpty } from "../../../utils"
import { Adventurer } from "../../dsl"
import AdventurerMiniWithInfo from "../adventurer-card/adventurer-card"
import { PixelArtImage, vh1 } from "../../utils"

const AdventurerSlotContainer = styled.div<{ interactuable: boolean }>`
    width: 100%;
    height: 22vh;
    width: 8vh;
    display: flex;
    align-items: center;
    justify-content: center;
    ${props => props.interactuable ? `cursor: pointer;` : ``}
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
                <AdventurerMiniWithInfo
                    adventurer={adventurer}
                    emoji={displayedEmoji}
                    render={render}
                    displayAPS={true}
                    units={vh1}
                />
            : <></> }
        </AdventurerSlotContainer>
    )
}

export default AdventurerSlot