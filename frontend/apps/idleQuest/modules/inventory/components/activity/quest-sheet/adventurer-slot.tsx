import styled from "styled-components"
import { useState } from "react"
import { Adventurer, If } from "../../../../../common"
import { PixelArtImage, vh1, notEmpty, vh } from "../../../../../utils"
import AdventurerMini from "./adventurer-mini"

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
            <If $if={notEmpty(adventurer)}>
                <AdventurerMiniWrapper>
                    <AdventurerMini
                        adventurer={adventurer!}
                        emoji={displayedEmoji}
                        render={render}
                        displayAPS={true}
                        units={vh(1.7)}
                    />
                </AdventurerMiniWrapper>
            </If>
        </AdventurerSlotContainer>
    )
}

export default AdventurerSlot