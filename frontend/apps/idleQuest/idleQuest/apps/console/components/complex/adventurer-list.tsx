import styled from "styled-components";
import { useState } from "react";
import { Adventurer, SelectedQuest } from "../../../../../dsl";
import AdventurerCard from "../../../availableQuest/components/adventurer-card";
import { notEmpty } from "../../../../../../utils";

const AdventurerListContainer = styled.div`
    position: relative;
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

const AdventurerCardContainer = styled.div<{ interactuable: boolean }>`
    width: 100%;
    background-color: rgb(51,65,74);
    padding: 0.5vmax 0 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
