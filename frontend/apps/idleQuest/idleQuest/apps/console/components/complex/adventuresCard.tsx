import styled from "styled-components";
import { ExperienceBar, Level, CooldownDeathTimmer, DeathCooldownIcon, PositionMedal } from "../basic_components";
import { ConditionalRender } from "../../../../../../utils/components/basic_components";
import { AdventurerSprite } from "../../../../utils/components/basic_component";
import { useGetAdventurerSelectClick } from "../../hooks";
import { Adventurer } from "../../../../../dsl";


interface AdventuresCardWrapperType{
    isSelectable: boolean
}

const AdventuresCardWrapper = styled.div<AdventuresCardWrapperType>`
    width: 100%;
    height: auto;
    
    ${props => props.isSelectable ? 'cursor: pointer;': null}
    position: relative;
    &:hover{
        ${props => props.isSelectable ? 'background-color: rgba(0,0,0,0.2) ;': null}
        
    }

`

const Center = styled.div`
    display: flex;
    height: inherit;

    div{
        margin: auto;
    }
`

interface IProps_ImageWrapper{
    in_quest? :boolean
    selectedInQuest? : boolean
}

const ImageWrapper = styled.div<IProps_ImageWrapper>`
    width: 100%;
    height: inherit;
`


const AdventuresName = styled.h3`
    font-size: 0.65vw;
    color: white;
    font-weight: 100;
    font-family: arial;
    margin-bottom: 0.2vw;
`

const LevelPosition = styled.div`
    margin-top: 0.2vw;
`

const Margin = styled.div`
    margin: 0vw 1.5vw;
    padding: 1vw 0vw 0vw 0vw;
`

const AttributesWrapper = styled.div`
    display: flex;
    height: 5vw;
    margin-left: 1vw;
 
`

const CenterVertical = styled.div`
    margin: auto;
`

const DeathCooldownIconPosition = styled.div`
    position: absolute;
    right: 0.5vw;
    top: 0.5vw;
`


const FlexLevelAndCoolDown = styled.div`
    display: flex;
`

const CoolDownWrapper = styled.div`
    margin-left: auto;
    margin-top: 0.2vw;
`

const PositionMedalPosition = styled.div`
    position: absolute;
    top: 1vw;
    left: 1vw;

`

interface AdventurerCardProps {
    data: Adventurer
    slotIndex?: number
}

const AdventurerCard = ({data, slotIndex}:AdventurerCardProps ) =>{
  
    //este elemento hace drageable todo la tarjeta
    // const drag = useDragElement( data )

    const { selAdventurer, isQuestSelected } = useGetAdventurerSelectClick()

    const selected = slotIndex !== undefined
    const render
        = data.hp == 0 && data.collection !== "grandmaster-adventurers" ? "dead" 
        : data.inChallenge ? "questing"
        : selected ? "selected"
        : "normal"

    return(
    <>
        
        {/* <AdventuresCardWrapper ref ={data.in_quest == false  && selectedInQuest == false && (data.metadata.is_alive == true || data.metadata.is_alive == undefined) ? drag : null}> */}
        <AdventuresCardWrapper 
            onClick={() =>  data.hp > 0 ? selAdventurer(data, selected) : null}
            isSelectable = {isQuestSelected}
        >
            <Margin>
               
                <ImageWrapper>
                    <Center>
                        <div>
                            <AdventurerSprite  
                                adventurer={data}  
                                render={render}
                            />
                        </div>
                    </Center>
                </ImageWrapper>
                            
                        
                <AttributesWrapper>
                    <CenterVertical>
                        <AdventuresName>
                            {data.name}
                        </AdventuresName>
                
                        <ExperienceBar experience={0} />
                        
                        <FlexLevelAndCoolDown>

                            <LevelPosition>
                                <Level experience={0}/>
                            </LevelPosition>
                            
                            <ConditionalRender condition={data.collection == "grandmaster-adventurers" && data.hp == 0 }>
                                <CoolDownWrapper>
                                    <CooldownDeathTimmer coolDownTime={0} />
                                </CoolDownWrapper>
                            </ConditionalRender>
                        </FlexLevelAndCoolDown>

                    </CenterVertical>
                </AttributesWrapper>
              
                    
            </Margin>

            <ConditionalRender condition = {selected}>
                <PositionMedalPosition>
                    <PositionMedal>
                        {(slotIndex! + 1).toString()}
                    </PositionMedal>
                </PositionMedalPosition>
            </ConditionalRender>

            <ConditionalRender condition ={data.collection == "grandmaster-adventurers" && data.hp == 0} >
                <DeathCooldownIconPosition>
                    <DeathCooldownIcon/>
                </DeathCooldownIconPosition>
            </ConditionalRender>
          
        </AdventuresCardWrapper>
    </>)

}

export default AdventurerCard