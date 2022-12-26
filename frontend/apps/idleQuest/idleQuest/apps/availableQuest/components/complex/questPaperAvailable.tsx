import styled from "styled-components";
import { useState, useRef } from "react";
import { takeAvailableQuest } from "../../features/availableQuest"
import Image from 'next/image'
import { useIsOpenAvailableQuest, useGetAvailableQuestData, useResetSelectAdventurers } from "../../hooks";
import { QuestLabelLevel, 
        RescalingMonster, 
        SucceedChance, 
        Seals, 
        Signature } from "../../../../utils/components/basic_component";
import { QuestRequirementsSection, ProgressionQuest } from "../../../../utils/components/complex";
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { DropBox } from "../basic_components";




const AnimationWrapper = styled.div`
    width: 38vw;
    height: 43.4vw;
    margin: 0vw 22vw;
    display: Flex;
`

interface animation {
    isClose: boolean
}


const AnimationWrapperRelative = styled.div`
    position: relative;
    margin: auto 0vw;
`


const PaperAnimation = styled.div<animation>`
    width: 38vw;
    height: 0vw;
    position: absolute;
    top: 0vw;
    left: 22vw;
    z-index: 10;
    overflow: hidden;
    top: ${props => props.isClose == true  ? "-40"  : " 43.4"}vw;
    height: ${props => props.isClose == true  ? "43.4"  : "0"}vw;
    transition: top ${props => props.isClose == true  ? "0.8s"  : "1s"}, height ${props => props.isClose == true  ? "0.8s"  : "1s"};
`

interface cardWrapper {
    isClose: boolean
    ref: any
}

const CardWrapper = styled.div<cardWrapper>`
    display: Flex;
    overflow: hidden;
    width: inherit;
    height: ${props => props.isClose == true  ? "0"  : "43.4"}vw;
    transition: height ${props => props.isClose == true  ? "0.8s"  : "1s"};
`

const PaperBackground = styled.div`
    position: absolute;
    z-index: -1;
    width: inherit;
    height: inherit;
`

const Card = styled.div`
    position: relative;
    width: inherit;    
`


const Title = styled.h2`
    text-align: left;
    font-family: VT323;
    font-size: 1.7vw;
    font-weight: 900;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
    padding: 0vw 3.5vw;
    margin-top: 1.5vw;
`

const Flex = styled.div`
    display: flex;
`

const Details = styled.div`
    margin-top: 2vw;
    width: 65%;
    height: 10.5vw;
    padding: 0vw 1.5vw 0vw 3vw;
    
    p{
        font-family: VT323;
        font-size: 1vw;
        color: #793312;
        line-height: 1.5vw;
        font-weight: 100;
    }
`

const MonsterWrapper = styled.div`
    width: 40%;
    width: 9vw;
    height: 14vw;
    position: absolute;
    right: 2vw;
    top: 1vw;

`

const ProgressionWrapper = styled.div`
    padding: 0vw 0vw;
    margin: 4vw 0vw 1vw 0vw;
`

const Adventurer = styled.div`
    padding: 0vw 1vw;
    margin-top: 1vw;
    width: 100%;
    z-index: 2;
`

interface ShadowWrapper {
    isClose: boolean
    ref: any
}

const ShadowWrapper = styled.section<ShadowWrapper>`
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    visibility: ${props => props.isClose == true  ? "hidden"  : "visible "};
    opacity: ${props => props.isClose == true  ? "0"  : "1"};
    transition: opacity 1s, visibility 1s;
`



const TitleSection = styled.div`
    display: flex;
    position: relative;
`

const QuestRequirementsSectionPosition = styled.div`
    position: absolute;
    left: 22vw;
    top: 1.5vw;

`

const LabelWrapper = styled.div`
    position: absolute;
    top: -0.1vw;
    right: 1vw;
`

const  CornerRightDown = styled.div`
    position: absolute;
    right: 1vw;
    top: 33vw;
    z-index: 0;

`

const SucceedChanceWrapper = styled.div`
    position: absolute;
    right: -1vw;
    top: 15.5vw;
`

const QuestPaperAvailable = () => {

    const shadowWrapper = useRef<HTMLDivElement | null>(null)
    const questPaper = useRef<HTMLDivElement | null>(null)

    const isOpen = useIsOpenAvailableQuest(shadowWrapper, questPaper)


    const questData = useGetAvailableQuestData()

    const [slots, setSlots] = useState(Array(questData.slots).fill('')) 

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()    

    const selectedAdventurers = generalSelector.idleQuest.questAvailable.data.selectAdventurer.selectAdventurer
        
    useResetSelectAdventurers(!isOpen)


    return(<>
        <ShadowWrapper  isClose ={!isOpen} ref={shadowWrapper}>
            <AnimationWrapperRelative>

                <PaperAnimation isClose ={!isOpen}>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png"  width={406} height={466} layout="responsive" />
                </PaperAnimation>

                <AnimationWrapper>
                    <CardWrapper isClose ={!isOpen} ref ={questPaper}> 
                        <Card>

                            <PaperBackground>
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png"  alt="paper prop" width={406} height={466} layout="responsive" />
                            </PaperBackground>
                            

                            <LabelWrapper>
                                <QuestLabelLevel>
                                    {questData.difficulty.toString()}
                                </QuestLabelLevel>
                            </LabelWrapper>
                            

                            <TitleSection>

                                <Title>{questData.name}</Title>

                                <QuestRequirementsSectionPosition>
                                    {/* FIXME: this element is no working */}
                                    {/* <QuestRequirementsSection 
                                        requirements ={questData.requirements} 
                                        adventuresSelected={selectedAdventurers!}
                                        callbackBonus = {(bonus: number) => setBonus(bonus)}
                                    /> */}
                                </QuestRequirementsSectionPosition>

                            </TitleSection>

                            <Flex>
                                <Details >
                                    <p  dangerouslySetInnerHTML={{__html: questData.description}}/> 
                                </Details>

                                <MonsterWrapper>
                                    <RescalingMonster src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg" />
                                </MonsterWrapper>

                                <SucceedChanceWrapper>
                                    <SucceedChance 
                                        questDifficulty={questData.difficulty}
                                        questSlots={questData.slots}
                                        // FIXME: bonus
                                        requirementBonus= {50}
                                        adventurersList ={selectedAdventurers}
                                        type = "available"
                                    />
                                </SucceedChanceWrapper>

                            </Flex>

                            <ProgressionWrapper>
                                <ProgressionQuest 
                                    startTime ={new Date()} 
                                    duration ={questData.duration} 
                                    dsReward={questData.reward_ds}
                                /> 
                            </ProgressionWrapper>

                            <Flex>
                                <Adventurer>
                                    <Flex>
                                        {slots.map((el: number, index: number) => {
                                            return <DropBox key={index} index ={index} questLevel={questData.difficulty} reset ={!isOpen}/>
                                        })}    
                                    </Flex>
                                </Adventurer>

                                <CornerRightDown>
                                    <Seals seal = {questData.rarity}/>
                                </CornerRightDown>
                                
                            </Flex>
                            <Signature available ={true} onClick = {() => generalDispatch(takeAvailableQuest(questData.id, selectedAdventurers, questData.uiid! )) }/>
                        
                        </Card>
                    </CardWrapper> 
                </AnimationWrapper>
            </AnimationWrapperRelative>
        </ShadowWrapper>
    </>)
}

export default QuestPaperAvailable