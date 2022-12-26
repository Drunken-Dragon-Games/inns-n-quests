import styled from "styled-components";
import Image from "next/image"

import { useState } from "react";
import { Timmer } from "../basic_components";
import { rolls, stamps } from "../../../../../settings";
import { ConditionalRender, TextOswald } from "../../../../../../utils/components/basic_components";
import { DragonSilverIconTakenQuest } from "../basic_components"
import {  useGeneralDispatch } from "../../../../../../../features/hooks"
import { setInProgressQuestSelected } from "../../../../features/interfaceNavigation";
import { useIsQuestSelected } from "../../hooks";


const Card = styled.div<card>`
    width: 95%;
    height: 6vw;
    cursor:pointer;
    padding: 1vw 1.5vw 0 vw 1.5vw;;
    position: relative;
    &:hover{
        background-color: rgba(0,0,0,0.3)
    }
`
const LeftCornerWrapper = styled.div`
    position: absolute;
    left: 1vw;
    bottom: 0vw;
    img{
        width: 3vw !important;
        height: 3vw !important;
    }
`

const RightCornerWrapper = styled.div`
    position: absolute;
    right: 0vw;
    top: 0vw;
    img{
        width: 3vw !important;
        height: 3vw !important;
    }
`

const ScrollWrapper =styled.div`
    margin-left: 2.5vw;
    margin-top: 1.5vw;
    width: 25%;
    position: relative;
`

const QuestDetails = styled.div`
    display: flex;
    width: 70%;
    margin-top: 1vw;
`

const Center = styled.div`
    margin: auto;
`

const Title = styled.h2 <title>`
    color: ${props => props.succeeded  ? "#cba044": "white"};
    font-size: 0.9vw;
    font-family: Oswald;
    font-weight: ${props => props.succeeded  ? "500": "200"};
    text-align: center;
    margin-bottom: 0.6vw;
    text-transform: uppercase;
`

const Flex = styled.div`
    display: flex;

`

const CenterFlex = styled.div`
    margin: auto;
    display: flex;
`

const HappeningText = styled.div`
    p{
        text-transform: uppercase;
        text-align: center;
        font-weight: 200;
    }
`

const StampWrapper = styled.div`
    position: absolute;
    top: 0vw;
`

interface title {
    succeeded: boolean,
}

interface card{
    onClick: any,
}

interface inProgressCard {
    data: inProgressQuest
    index: number
}


interface inProgressQuest{
    enrolls: enrolls []
    id: string
    is_claimed: boolean
    player_stake_address: string
    quest: quest
    quest_id: string
    started_on: string
    state: "failed" | "succeeded" | "in_progress" | null
}

interface quest{
    description: string
    difficulty: number
    duration: number
    id: string
    name: string
    rarity: string
    reward_ds: number
    reward_xp: number
    slots: number
}

interface enrolls{
    adventurer: adventurer
    adventurer_id: string
    taken_quest_id: string
}

interface adventurer{
    experience: number
    id: string
    in_quest: boolean
    metadata: metadata
    on_chain_ref: string
    player_stake_address: string
    type: "pixeltile" | "gma"
} 
interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
}



const TakeQuest = ({data, index}: inProgressCard) => {

    // FIXME: add this when inProgress is ready 


    const [onHover, setOnHover] = useState<boolean>(false)

    const generalDispatch = useGeneralDispatch()
    const selected = useIsQuestSelected(index)    

    return (
        <>
            <Card onClick={selected ==false ? () => generalDispatch(setInProgressQuestSelected(index)) : null} onMouseOver={()=> setOnHover(true)} onMouseLeave={()=> setOnHover(false)}>
                <LeftCornerWrapper>
                    <Image src= {selected || onHover ?"https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/selected_left_corner.png" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/unselected_left_corner.png"}  alt="corner detail" width={400} height={65} />
                </LeftCornerWrapper>
                <RightCornerWrapper>
                    <Image src= {selected || onHover ?"https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/selected_right_corner.png" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/unselected_right_corner.png"}   alt="corner detail" width={400} height={65} />
                </RightCornerWrapper>

                <Flex>
                    <ScrollWrapper>
                        
                        <Image src= {rolls[data.quest.rarity ]}  alt="corner detail" width={50} height={50} layout ="responsive"/>
                        
                        <ConditionalRender condition={data.state == "succeeded" || data.state == "failed"}>
                            <StampWrapper>
                                <Image src= {stamps[data.state!]}  alt="corner detail" width={50} height={50} />
                            </StampWrapper>
                        </ConditionalRender>
                        
                    </ScrollWrapper>

                    <QuestDetails>
                        <Center>
                            <Title succeeded ={data.state == "succeeded"}> {data.quest.name}</Title>
                            <Flex>
                                <CenterFlex>

                                    <DragonSilverIconTakenQuest dragonSilverReward={data.quest.reward_ds}/>
                
                                    <Timmer startTime={data.started_on} duration={data.quest.duration} questStatus={data.state}/>
                    
                                </CenterFlex>
                            </Flex>
                        
                            <ConditionalRender condition={data.state == "in_progress"}>
                                <HappeningText><TextOswald fontsize={0.8} color="white" textAlign="center">happening</TextOswald></HappeningText>
                            </ConditionalRender>

                        </Center>   
                    </QuestDetails>
                </Flex>
        
            </Card>
        </>
    )
}

export default TakeQuest