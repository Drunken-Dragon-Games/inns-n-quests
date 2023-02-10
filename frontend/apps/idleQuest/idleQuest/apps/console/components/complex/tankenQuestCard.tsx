import styled from "styled-components";
import Image from "next/image"
import { useState } from "react";
import { Timmer } from "../basic_components";
import { ConditionalRender, TextOswald } from "../../../../../../utils/components/basic_components";
import { DragonSilverIconTakenQuest } from "../basic_components"
import {  useGeneralDispatch } from "../../../../../../../features/hooks"
import { TakenQuest } from "../../../../../dsl/models";
import { takenQuestStatus } from "../../../../../dsl";
import { selectQuest } from "../../../availableQuest/features/quest-board";

const Card = styled.div<{ onClick: any }>`
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

const Title = styled.h2 <{ finished: boolean }>`
    color: ${props => props.finished  ? "#cba044": "white"};
    font-size: 0.9vw;
    font-family: Oswald;
    font-weight: ${props => props.finished  ? "500": "200"};
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




interface TakenQuestCardProp {
    takenQuest: TakenQuest,
    selected: boolean
}


const TakenQuestCard = ({takenQuest, selected}: TakenQuestCardProp) => {

    const [onHover, setOnHover] = useState<boolean>(false)

    const generalDispatch = useGeneralDispatch()
    const status = takenQuestStatus(takenQuest)    

    return (
        <>
            <Card onClick={selected ==false ? () => generalDispatch(selectQuest(takenQuest)) : null} onMouseOver={()=> setOnHover(true)} onMouseLeave={()=> setOnHover(false)}>
                <LeftCornerWrapper>
                    <Image src= {selected || onHover ?"https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/selected_left_corner.png" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/unselected_left_corner.png"}  alt="corner detail" width={400} height={65} />
                </LeftCornerWrapper>
                <RightCornerWrapper>
                    <Image src= {selected || onHover ?"https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/selected_right_corner.png" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/unselected_right_corner.png"}   alt="corner detail" width={400} height={65} />
                </RightCornerWrapper>

                <Flex>
                    <ScrollWrapper>
                        
                        <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/kings_plea.png"  alt="corner detail" width={50} height={50} layout ="responsive"/>
                        
                        <ConditionalRender condition={status == "finished"}>
                            <StampWrapper>
                                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/claim_reward.png" alt="corner detail" width={50} height={50} />
                            </StampWrapper>
                        </ConditionalRender>
                        
                    </ScrollWrapper>

                    <QuestDetails>
                        <Center>
                            <Title finished={status == "finished"}>{takenQuest.quest.name}</Title>
                            <Flex>
                                <CenterFlex>

                                    <DragonSilverIconTakenQuest dragonSilverReward={0}/>
                
                                    <Timmer takenQuest={takenQuest} />
                    
                                </CenterFlex>
                            </Flex>
                        
                            <ConditionalRender condition={status == "in-progress"}>
                                <HappeningText><TextOswald fontsize={0.8} color="white" textAlign="center">happening</TextOswald></HappeningText>
                            </ConditionalRender>

                        </Center>   
                    </QuestDetails>
                </Flex>
        
            </Card>
        </>
    )
}

export default TakenQuestCard