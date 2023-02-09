import styled from "styled-components";
import { ExperienceBar, Level, CooldownDeathTimmer, DeathCooldownIcon, PositionMedal } from "../basic_components";
import { ConditionalRender } from "../../../../../../utils/components/basic_components";
import { RescalingImg } from "../../../../utils/components/basic_component";
import { useGetAdventurerSelectClick, useGetPositionMedal } from "../../hooks";
import { DataAdventurerType } from "../../../../../../../types/idleQuest";


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

interface IProps_AdventuresCard{
    data: DataAdventurerType
    selectedInQuest?: boolean
    
}


const AdventuresCard = ({data, selectedInQuest}:IProps_AdventuresCard ) =>{
  
    //este elemento hace drageable todo la tarjeta
    // const drag = useDragElement( data )

    const { selAdventurer, isQuestSelected } = useGetAdventurerSelectClick()

    const position = useGetPositionMedal(data.adventurerId)

    return(
    <>
        
        {/* <AdventuresCardWrapper ref ={data.in_quest == false  && selectedInQuest == false && (data.metadata.is_alive == true || data.metadata.is_alive == undefined) ? drag : null}> */}
        <AdventuresCardWrapper 
            onClick={() =>  data.metadata.dead_cooldown ? null : selAdventurer(data.adventurerId, selectedInQuest!)}
            isSelectable = {isQuestSelected}
        >
            <Margin>
               
                <ImageWrapper>
                    <Center>
                        <div>
                            <RescalingImg  
                                src= {data.sprite}  
                                inQuest={data.inChallenge} 
                                selectedInQuest = {selectedInQuest} 
                                is_alive ={data.collection == "grandmaster-adventurers" ? data.hp > 0 : null }
                                collection={data.collection}
                            />
                        </div>
                    </Center>
                </ImageWrapper>
                            
                        
                <AttributesWrapper>
                    <CenterVertical>
                        <AdventuresName>
                            {data.name}
                        </AdventuresName>
                
                        <ExperienceBar experience={data.experience} />
                        
                        <FlexLevelAndCoolDown>

                            <LevelPosition>
                                <Level experience={data.experience}/>
                            </LevelPosition>
                            
                            <ConditionalRender condition={data.collection == "grandmaster-adventurers" && data.hp == 0 }>
                                <CoolDownWrapper>
                                    <CooldownDeathTimmer coolDownTime={data.metadata.dead_cooldown!} />
                                </CoolDownWrapper>
                            </ConditionalRender>
                        </FlexLevelAndCoolDown>

                    </CenterVertical>
                </AttributesWrapper>
              
                    
            </Margin>

            <ConditionalRender condition = {position !== -1}>
                <PositionMedalPosition>
                    <PositionMedal>
                        {(position + 1).toString()}
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

export default AdventuresCard