import styled from "styled-components";
import { useState } from "react";
import Image from 'next/image'
import { useOpenInProgressPaper } from "../../hooks";
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useGetInProgressData, useGetAdventurerPng, useGetClaimRewardShadow, useGetAdventurersEnrollsRequirements } from "../../hooks"
import { QuestLabelLevel, 
    RescalingMonster, 
    SucceedChance, 
    Seals, 
    RescalingImg,
    Signature } from "../../../../utils/components/basic_component";
import { QuestRequirementsSection, ProgressionQuest } from "../../../../utils/components/complex";
import { Adventurer } from "."


const CardWrapper = styled.div<animation>`
    display: Flex;
    overflow: hidden;
    width: inherit;
    height: ${props => props.isClose == true  ? "0"  : "43.4"}vw;
    transition: height ${props => props.isClose == true  ? "0.8s"  : "1s"};
`

const AnimationWrapper = styled.div`
    width: 38vw;
    height: 43.4vw;
    margin: 0vw 22vw;
    display: Flex;
`
interface AnimationWrapperRelative {
    isClose: boolean
}

const AnimationWrapperRelative = styled.div<AnimationWrapperRelative>`
    position: relative;
    margin: auto 0vw;
    visibility: ${props => props.isClose == true  ? "hidden"  : "visible "};
    opacity: ${props => props.isClose == true  ? "0"  : "1"};
    transition: opacity 1s, visibility 1s;
`

const PaperBackground = styled.div`
    position: absolute;
    z-index: -1;
    width: 38vw;
    height: 0vw;
`
interface animation {
    isClose: boolean
}

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
const Card = styled.div`
    margin: auto;
    position: relative;
    width: 38vw;
    height: 43.4vw;
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
    overflow: hidden;
    max-width: 25vw;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const Flex = styled.div`
    display: flex;
    
`

const Details = styled.div`
    margin-top: 2vw;
    width: 60%;
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

const AdventurerWrapper = styled.div`
    padding: 0vw 1vw;
    margin-top: 0.5vw;
    width: 100%;
`

interface shadow {
    successful: boolean
}

const Shadow = styled.div<shadow>`
    position: absolute;
    top: 0px;
    left: 0vw;
    width: 38vw;
    height: 43.4vw;
    z-index: 5;
    background-color: rgba(0,0,0, 0.5);
    opacity: ${props => props.successful ? "1" : "0"};
    visibility:${props => props.successful ? "visible " : "hidden"};
    transition: opacity 1s, visibility 1s;
`

const  CornerRightDown = styled.div`
    position: absolute;
    right: 1vw;
    top: 33vw;
    z-index: 0;

`

const TitleSection = styled.div`
    display: flex;
    position: relative;
`

const QuestRequirementsSectionPosition = styled.div`
    position: absolute;
    left: 24vw;
    top: 1.5vw;
`

const LabelWrapper = styled.div`
    position: absolute;
    top: -0.1vw;
    right: 1vw;
`

const SucceedChanceWrapper = styled.div`
    position: absolute;
    right: -1vw;
    top: 15.5vw;
`




const QuestPaperInProgress = () => {
            

    const [ bonus, setBonus] = useState<number>(0)

    const inProgressQuestData = useGetInProgressData()

    const isClose = useOpenInProgressPaper(inProgressQuestData.id)
        
    const requirements = inProgressQuestData.quest.requirements

    const adventurersEnrollsRequirements = useGetAdventurersEnrollsRequirements(inProgressQuestData.enrolls)

    const adventurersEnrolls = inProgressQuestData.enrolls

    const [pngAdvernturer] = useGetAdventurerPng()   

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const isClaimedData = generalSelector.idleQuest.questsInProgress.data.claimReward

    const questClaimStatus = generalSelector.idleQuest.questsInProgress.Status.claimReward.status

    const  claimShadowEffect  =useGetClaimRewardShadow(inProgressQuestData.state, questClaimStatus)

    return(<>
            
                <AnimationWrapperRelative isClose = {isClose}>

                        <PaperAnimation isClose = {isClose}>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png"  alt="paper prop" width={406} height={466} layout="responsive" />
                        </PaperAnimation>
                        <AnimationWrapper>
                            
                            <CardWrapper isClose = {isClose}>
                                
                                <Card>
                                    <Shadow successful={claimShadowEffect}/>
                                    <PaperBackground>
                                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png"  alt="paper prop" width={406} height={466} layout="responsive"/>
                                    </PaperBackground>

                                    
                                    <LabelWrapper>
                                        <QuestLabelLevel>
                                            {"0"}
                                        </QuestLabelLevel>
                                    </LabelWrapper>
                                    
                                    <TitleSection>
                                        <Title>{inProgressQuestData.quest.name}</Title>
                                        <QuestRequirementsSectionPosition>
                                            <QuestRequirementsSection 
                                                requirements ={ {} } 
                                                adventuresSelected={adventurersEnrollsRequirements}
                                                callbackBonus = {(bonus: number) => setBonus(bonus)}
                                            />
                                        </QuestRequirementsSectionPosition>
                                    </TitleSection>
                                    

                                    <Flex>
                                        <Details>
                                            <p dangerouslySetInnerHTML={{__html: inProgressQuestData.quest.description}}/> 
                                        </Details>

                                        <MonsterWrapper>
                                            <RescalingMonster src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"/>
                                        </MonsterWrapper>

                                        <SucceedChanceWrapper>
                                            <SucceedChance
                                                questDifficulty = {0}//inProgressQuestData.quest.difficulty}
                                                questSlots = {5}//inProgressQuestData.quest.slots}
                                                requirementBonus = {bonus}
                                                adventurersList = {adventurersEnrolls}
                                                type = "inProgress"
                                            />
                                        </SucceedChanceWrapper>
                                    </Flex>

                                    <ProgressionWrapper>
                                        <ProgressionQuest 
                                            startTime ={inProgressQuestData.started_on} 
                                            duration ={inProgressQuestData.quest.duration} 
                                            inProgress = {true} 
                                            questState={inProgressQuestData.state}
                                            selected = {inProgressQuestData}
                                            dsReward={0}//inProgressQuestData.quest.reward_ds}
                                        />
                                    </ProgressionWrapper>
                                
                                    <Flex>
                                        <AdventurerWrapper>
                                            <Flex>
                                        
                                                {adventurersEnrolls.map((el) =>{
                                                    
                                                    
                                                    const adventurerData = pngAdvernturer(el.adventurer_id, generalSelector.idleQuest.adventurers.data.data)
                                                                
                                                                
                                                    return  <Adventurer data ={el} 
                                                                        questLevel = {0}//inProgressQuestData.quest.difficulty} 
                                                                        key = {el.adventurer_id} 
                                                                        claimed = {isClaimedData} 
                                                                        isDead = {isClaimedData.dead_adventurers}
                                                                        rewardExp={isClaimedData.exp_given}
                                                                    
                                                            >
                                                                <RescalingImg  
                                                                    src = {adventurerData.src}
                                                                    collection = {adventurerData.collection}
                                                                /> 
                                                            </Adventurer>  
                                                })}  
                                            </Flex>
                                        </AdventurerWrapper>
                                        <CornerRightDown>
                                            <Seals seal = {"kings_plea"} />
                                        </CornerRightDown>
                                    </Flex>
                                    <Signature />
                                </Card>
                            </CardWrapper>
                        </AnimationWrapper>
                </AnimationWrapperRelative>
            
    </>)
}

export default QuestPaperInProgress