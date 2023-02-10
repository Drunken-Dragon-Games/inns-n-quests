import styled from "styled-components";
import Image from 'next/image'
import { CreateAdventurerButton } from "../basic_components";
import { useRef, useState } from "react";
import { useIsScroll } from "../../hooks"
import { cardano_network } from "../../../../../../../setting"
import { Adventurer, SelectedQuest } from "../../../../../dsl";
import { ConditionalRender } from "../../../../../../utils/components/basic_components";
import AdventurerCard from "../../../availableQuest/components/adventurer-card";
import { notEmpty } from "../../../../../../utils";

const AdventurerListContainer = styled.div`
    position: relative;
`

const AdventurerListWrapper = styled.div`
    width: 97%;
    height: 91vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    overflow: auto;
    z-index: 1;
    ::-webkit-scrollbar {
        width: 0.4vw; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vw solid transparent;
        border-right: 0.1vw solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vw solid rgba(0, 0, 0, 0);
        border-right: 0.5vw  solid #8A8780;
        border-bottom: 0.3vw  solid rgba(0, 0, 0, 0);;
        border-left: 0.5vw  solid #8A8780;
    }
      
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #585652; 
    }
`

const ArrowDecreseContainer = styled.div`
      position: absolute;
      bottom: -2vw;
      right: 0.15vw;
      cursor: pointer;  

      img{
          width: 1vw !important;
          height: 1vw !important;
      }
`

const ArrowIncreseContainer = styled.div`
      position: absolute;
      top: -0.9vw;
      right: 0.15vw;
      cursor: pointer;  

      img{
          width: 1vw !important;
          height: 1vw !important;
      }
`

const AdventurerCardContainer = styled.div<{ interactuable: boolean }>`
    width: 83%;
    margin-left: 1.8vw;
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

const AdventurerList = ({ adventurers, adventurerSlots, selectedQuest, onAdventurerClick }: AdventurerListProps) =>{
    const scrolling = useRef<HTMLDivElement | null>(null)
    const renderArrows = useIsScroll(scrolling, adventurers.length)
    return(
        <AdventurerListContainer>

            <ConditionalRender condition={renderArrows}>
                <ArrowIncreseContainer>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scroll_arrow_increse.png" 
                        alt="scroll arrow" width={20} height={20}  />
                </ArrowIncreseContainer>
            </ConditionalRender>
          
            <AdventurerListWrapper ref={scrolling}>
                {adventurers.map((adventurer: Adventurer) =>
                    <AdventurerCardWrapper 
                        key={adventurer.adventurerId}
                        adventurer={adventurer} 
                        adventurerSlots={adventurerSlots} 
                        selectedQuest={selectedQuest}
                        onAdventurerClick={onAdventurerClick} 
                    />
                )}
                <ConditionalRender condition={cardano_network() == 0}>
                    <CreateAdventurerButton/>
                </ConditionalRender>
            </AdventurerListWrapper>

            <ConditionalRender condition={renderArrows}>
                <ArrowDecreseContainer>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scroll_arrow_decrese.png" 
                        alt="scroll arrow" width={20} height={20}/>
                </ArrowDecreseContainer>
            </ConditionalRender>
        </AdventurerListContainer>
    )
}

export default AdventurerList
