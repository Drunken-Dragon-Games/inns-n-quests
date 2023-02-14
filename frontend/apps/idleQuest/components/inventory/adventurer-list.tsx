import styled from "styled-components"
import { useState } from "react"
import { Adventurer, SelectedQuest } from "../../dsl"
import AdventurerCard from "../adventurer-card/adventurer-card"
import { notEmpty } from "../../../utils"
import InventoryBox from "./inventory-box"

const AdventurerListContainer = styled.div`
    width: 100%;
    padding: 0 0.5vmax;
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-direction: column;
    align-items: center;
    gap: 0.5vmax;

    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 1;

    ::-webkit-scrollbar {
        width: 0.4vmax; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vmax solid transparent;
        border-right: 0.1vmax solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vmax solid rgba(0, 0, 0, 0);
        border-right: 0.5vmax  solid #8A8780;
        border-bottom: 0.3vmax  solid rgba(0, 0, 0, 0);;
        border-left: 0.5vmax  solid #8A8780;
    }
      
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #585652; 
    }
`

const AdventurerCardContainer = styled(InventoryBox)<{ interactuable: boolean }>`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    ${props => props.interactuable ? "cursor: pointer;" : ""}
`

interface AdventurerCardWrapperProps {
    adventurer: Adventurer,
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    onAdventurerClick: (adventurer: Adventurer) => void
}

const AdventurerCardWrapper = ({ adventurer, adventurerSlots, selectedQuest, onAdventurerClick }: AdventurerCardWrapperProps) => {
    const slotIndex = adventurerSlots.indexOf(adventurer) + 1
    const [hovering, setHovering] = useState(false)
    const dead = adventurer.hp === 0
    const inChallenge = adventurer.inChallenge
    const selected = adventurerSlots.some(slot => slot?.adventurerId == adventurer.adventurerId)
    const interactuable = notEmpty(selectedQuest) && selectedQuest.ctype == "available-quest" && !inChallenge && !dead 
    const emoji = hovering ? adventurer.adventurerId : undefined
    const render 
        = dead ? "dead"
        : selected ? "selected"
        : inChallenge ? "in-challenge"
        : interactuable && hovering ? "hovered" 
        : "normal"
    return (
        <AdventurerCardContainer 
            onClick={() => interactuable && onAdventurerClick(adventurer)} 
            onMouseEnter={() => setHovering(true)} 
            onMouseLeave={() => setHovering(false)}
            interactuable={interactuable}
        >
            <AdventurerCard
                key={adventurer.adventurerId}
                adventurer={adventurer}
                medalNumber={slotIndex === 0 ? undefined : slotIndex}
                displayAPS={true}
                render={render}
                emoji={emoji}
            />
        </AdventurerCardContainer>
    )
}

interface AdventurerListProps {
    adventurers: Adventurer[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    onAdventurerClick: (adventurer: Adventurer) => void
}

const AdventurerList = ({ adventurers, adventurerSlots, selectedQuest, onAdventurerClick }: AdventurerListProps) =>
    <AdventurerListContainer>
        {adventurers.map((adventurer: Adventurer) =>
            <AdventurerCardWrapper
                key={adventurer.adventurerId}
                adventurer={adventurer}
                adventurerSlots={adventurerSlots}
                selectedQuest={selectedQuest}
                onAdventurerClick={onAdventurerClick}
            />
        )}
    </AdventurerListContainer>

export default AdventurerList
