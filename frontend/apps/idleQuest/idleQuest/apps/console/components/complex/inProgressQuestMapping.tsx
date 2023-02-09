import styled from "styled-components";
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useRef } from "react";
import Image from 'next/image'
import { useIsScroll } from "../../hooks";
import { ConditionalRender } from '../../../../../../utils/components/basic_components';
import { TakenQuest } from ".";


const InProgressMappingWrapper = styled.div`

    position: relative;
`

const InProgressMapping = styled.div`
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
        border-right: 0.8vw  solid #8A8780;
        border-bottom: 0.3vw  solid rgba(0, 0, 0, 0);;
        border-left: 0.8vw  solid #8A8780;
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


const NoQuestWaring = styled.div`
    display: flex;
    height: 82vh;
    
    div{
        margin: auto;
        font-family: El Messiri;
        color: white;
        font-size: 1.1vw;
    }
`

const InProgressQuest = () =>{

   
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const scrolling = useRef<HTMLDivElement | null>(null)
    const numberOfQuests = generalSelector.idleQuest.questsInProgress.data.inProgressQuest.quests.length
    const quests = generalSelector.idleQuest.questsInProgress.data.inProgressQuest.quests  
    
    const renderArrows =  useIsScroll(scrolling, numberOfQuests)


    return (
        <>
          <InProgressMappingWrapper>

            <ConditionalRender condition = {renderArrows}>
                <ArrowIncreseContainer>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scroll_arrow_increse.png"  alt="Dragon silver icon" width={20} height={20}  />
                </ArrowIncreseContainer>
            </ConditionalRender>

                <InProgressMapping ref={scrolling}>

                    <ConditionalRender condition = {numberOfQuests > 0}>
                        { quests.map((el,  index) => {

                            return  <TakenQuest index={index} takenQuest={el} />
                        })}
                    </ConditionalRender>

                    <ConditionalRender condition = {numberOfQuests == 0}>
                        <NoQuestWaring>
                              <div>
                                There is no Quest in progress
                              </div>
                        </NoQuestWaring>
                    </ConditionalRender>

                </InProgressMapping>

          

                <ConditionalRender condition = {renderArrows}>
                    <ArrowDecreseContainer>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scroll_arrow_decrese.png"  alt="Dragon silver icon" width={20} height={20}  />
                    </ArrowDecreseContainer>
                </ConditionalRender>
          </InProgressMappingWrapper>

        </>
    )
}

export default InProgressQuest