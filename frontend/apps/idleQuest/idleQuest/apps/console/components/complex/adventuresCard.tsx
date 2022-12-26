import styled from "styled-components";
import { useDrag } from "react-dnd";
import { ExperienceBar, Level, CooldownDeathTimmer, DeathCooldownIcon } from "../basic_components";
import { ConditionalRender } from "../../../../../../utils/components/basic_components";
import { RescalingImg } from "../../../../utils/components/basic_component";
import { useDragElement } from "../../hooks";

const AdventuresCardWrapper = styled.div`
    width: 100%;
    height: auto;
    cursor: pointer;
    position: relative;
    &:hover{
        background-color: rgba(0,0,0,0.2) ;
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
interface IProps_AdventuresCard{
    data: DataAdventurer
    selectedInQuest?: boolean
    
}

interface DataAdventurer{
    id: string
    name: string,
    experience: number
    adventurer_img: string
    in_quest: boolean
    on_chain_ref: string
    onRecruitment?: boolean
    sprites: string
    type: "pixeltile" | "gma"
    metadata: metadata
    race: string
    class: string
  }

  interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
  }


const AdventuresCard = ({data, selectedInQuest}:IProps_AdventuresCard ) =>{
  
    //este elemento hace drageable todo la tarjeta
    const drag = useDragElement( data )

  
    
    return(
    <>
        
        <AdventuresCardWrapper ref ={data.in_quest == false  && selectedInQuest == false && (data.metadata.is_alive == true || data.metadata.is_alive == undefined) ? drag : null}>
            <Margin>
               
                <ImageWrapper>
                    <Center>
                        <div>
                            <RescalingImg  
                                src= {data.sprites}  
                                inQuest={data.in_quest} 
                                selectedInQuest = {selectedInQuest} 
                                is_alive ={data.type == "gma" ? data.metadata.is_alive : null }
                                type={data.type}
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
                            
                            <ConditionalRender condition={data.type == "gma" && data.metadata.is_alive == false }>
                                <CoolDownWrapper>
                                    <CooldownDeathTimmer coolDownTime={data.metadata.dead_cooldown!} />
                                </CoolDownWrapper>
                            </ConditionalRender>
                        </FlexLevelAndCoolDown>

                    </CenterVertical>
                </AttributesWrapper>

                    
            </Margin>

            <ConditionalRender condition ={data.type == "gma" && data.metadata.is_alive == false} >
                <DeathCooldownIconPosition>
                    <DeathCooldownIcon/>
                </DeathCooldownIconPosition>
            </ConditionalRender>
          
        </AdventuresCardWrapper>
    </>)

}

export default AdventuresCard