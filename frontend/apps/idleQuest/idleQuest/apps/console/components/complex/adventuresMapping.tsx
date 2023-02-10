import styled from "styled-components";
import { CreateAdventurerButton } from "../basic_components";
import { useRef } from "react";
import Image from 'next/image'
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useIsScroll } from "../../hooks"
import { cardano_network } from "../../../../../../../setting"
import { ConditionalRender } from '../../../../../../utils/components/basic_components';
import { Adventurer } from "../../../../../dsl";
import AdventurerCard from "./adventuresCard";

const AdventuresMappingWrapper = styled.div`

    position: relative;
`

const AdventuresMapping = styled.div`
    width: 97%;
    height: 82vh;
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
      bottom: -2vh;
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



const AdventureMappingElement = () =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const scrolling = useRef<HTMLDivElement | null>(null)
    const numberOfAdventurer = generalSelector.idleQuests.adventurers.data.adventurers.length
    const adventurers = generalSelector.idleQuests.adventurers.data.adventurers
    const selectedAdventurers = generalSelector.idleQuests.questBoard.questBoard.adventurerSlots
    
    
    const renderArrows =  useIsScroll(scrolling, numberOfAdventurer)
  
    return(
      <>
        <AdventuresMappingWrapper>

            <ConditionalRender condition = {renderArrows}>
                <ArrowIncreseContainer>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scroll_arrow_increse.png"  alt="Dragon silver icon" width={20} height={20}  />
                </ArrowIncreseContainer>
            </ConditionalRender>
        
          
            <AdventuresMapping ref={scrolling}>

                <ConditionalRender condition = {adventurers !== undefined}>
                    { adventurers.map((elOriginal: Adventurer) => {
                        const slotIndex = selectedAdventurers.indexOf(elOriginal)
                        return <AdventurerCard data={elOriginal} key={elOriginal.adventurerId} slotIndex={slotIndex < 0 ? undefined : slotIndex}/>
                    })}
                  
                </ConditionalRender>
        
            <ConditionalRender condition = {cardano_network() == 0 }>
                <CreateAdventurerButton/>
            </ConditionalRender>

            </AdventuresMapping>
          

            <ConditionalRender condition = {renderArrows}>
                    <ArrowDecreseContainer>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scroll_arrow_decrese.png"  alt="Dragon silver icon" width={20} height={20}/>
                    </ArrowDecreseContainer>
            </ConditionalRender>

        </AdventuresMappingWrapper>
      </>
    )

}

export default AdventureMappingElement
