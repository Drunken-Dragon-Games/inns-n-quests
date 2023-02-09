import styled from "styled-components";
import { useState, useRef } from "react";
import { takeAvailableQuest } from "../../features/quest-board"
import Image from 'next/image'
import { useIsOpenAvailableQuest, useGetAvailableQuestData, useResetSelectAdventurers } from "../../hooks";
import { QuestLabelLevel, 
        RescalingMonster, 
        Seals, 
        SuccessChance,
        Signature } from "../../../../utils/components/basic_component";
import { QuestRequirementsSection, ProgressionQuest } from "../../../../utils/components/complex";
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { DropBox } from "../basic_components";
import { AvailableQuest } from "../../../../../dsl";

const AnimationWrapper = styled.div`
    width: 38vw;
    height: 43.4vw;
    margin: 0vw 22vw;
    display: Flex;
`

const AnimationWrapperRelative = styled.div`
    position: relative;
    margin: auto 0vw;
`

const PaperAnimation = styled.div`
    width: 38vw;
    height: 0vw;
    position: absolute;
    top: 0vw;
    left: 22vw;
    z-index: 10;
    overflow: hidden;
    top: 43.4vw;
    height: 43.4vw;
    transition: top 1s, height 1s;
`

const CardWrapper = styled.div`
    display: Flex;
    overflow: hidden;
    width: inherit;
    height: 43.4;
    transition: height 1s;
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

const ShadowWrapper = styled.section`
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    opacity: 1;
    transition: opacity 1s, visibility 0.5s;
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

const StyledSuccessChance = styled(SuccessChance)`
    position: absolute;
    right: -1vw;
    top: 15.5vw;
`

interface QuestPaperAvailableProps {
    className?: string,
    quest?: AvailableQuest
    selectedAdventurers: string[],
    onSign?: () => void,
    onClose?: () => void,
}

export default ({ className, quest, selectedAdventurers, onSign, onClose }: QuestPaperAvailableProps) => {
    if (!quest) return (<></>)
    /*
    const shadowWrapper = useRef<HTMLDivElement | null>(null)
    const questPaper = useRef<HTMLDivElement | null>(null)

    //const isOpen = useIsOpenAvailableQuest(shadowWrapper, questPaper)

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()    

    useResetSelectAdventurers(!open)
    const selectedAdventurers = generalSelector.idleQuest.questAvailable.data.selectAdventurer.selectAdventurer
    
    () => generalDispatch(takeAvailableQuest(quest.id, selectedAdventurers, questData.uiid!)
    */

    return (
        <ShadowWrapper onClick={onClose}>
            <AnimationWrapperRelative>

                {/*
                <PaperAnimation open={open}>
                    <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png" width={406} height={466} layout="responsive" />
                </PaperAnimation>
                */}

                <AnimationWrapper>
                    <CardWrapper >
                        <Card>

                            <PaperBackground>
                                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png" alt="paper prop" width={406} height={466} layout="responsive" />
                            </PaperBackground>

                            <LabelWrapper>
                                <QuestLabelLevel>
                                    1
                                </QuestLabelLevel>
                            </LabelWrapper>

                            <TitleSection>
                                <Title>{quest.name}</Title>
                                <QuestRequirementsSectionPosition>
                                    <QuestRequirementsSection
                                        requirements={{}}//quest.requirements} 
                                        adventuresSelected={selectedAdventurers!}
                                    />
                                </QuestRequirementsSectionPosition>
                            </TitleSection>

                            <Flex>
                                <Details >
                                    <p dangerouslySetInnerHTML={{ __html: quest.description }} />
                                </Details>

                                <MonsterWrapper>
                                    <RescalingMonster src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg" />
                                </MonsterWrapper>

                                <StyledSuccessChance percentage={0} />

                            </Flex>

                            <ProgressionWrapper>
                                <ProgressionQuest />
                            </ProgressionWrapper>

                            <Flex>
                                <Adventurer>
                                    <Flex>
                                        {Array(quest.slots).fill(('') as any).map((el, index) => {
                                            return <DropBox
                                                key={index}
                                                index={index}
                                                questLevel={1}
                                                id={selectedAdventurers[index]}
                                            />
                                        })}
                                    </Flex>
                                </Adventurer>
                                <CornerRightDown>
                                    <Seals seal="kings_plea" />
                                </CornerRightDown>
                            </Flex>

                            <Signature questType="available" onClick={onSign} />
                        </Card>
                    </CardWrapper>
                </AnimationWrapper>
            </AnimationWrapperRelative>
        </ShadowWrapper>
    )
}
