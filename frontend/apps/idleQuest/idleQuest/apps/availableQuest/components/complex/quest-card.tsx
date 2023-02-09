import styled from "styled-components";
import Image from 'next/image'
import { QuestLabelLevel, 
        RescalingMonster, 
        Seals, 
        SuccessChance,
        Signature } from "../../../../utils/components/basic_component";
import { QuestRequirementsSection, ProgressionQuest } from "../../../../utils/components/complex";
import { DropBox } from "../basic_components";
import { AvailableQuest } from "../../../../../dsl";
import { CrispPixelArtBackground, CrispPixelArtImage, notEmpty } from "../../../../../../utils";

const BackShadow = styled.section<{ open: boolean }>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    opacity: ${props => props.open ? 1 : 0};
    visibility: ${props => props.open ? "visible" : "hidden"};
    transition: opacity 1s, visibility 0.5s;
`

const CardContainer = styled.div`
    position: relative;
    left: -10vw;
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

const Details = styled.p`
    margin-top: 2vw;
    width: 65%;
    height: 10.5vw;
    padding: 0vw 1.5vw 0vw 3vw;
    
    font-family: VT323;
    font-size: 1vw;
    color: #793312;
    line-height: 1.5vw;
    font-weight: 100;
`

const Monster = styled.div`
    width: 9vw;
    height: 14vw;
    position: absolute;
    right: 2vw;
    top: 2vw;
`

const StyledSuccessChance = styled(SuccessChance)`
    position: absolute;
    right: -1vw;
    top: 15.5vw;
`

const ProgressionWrapper = styled.div`
    padding: 0vw 0vw;
    margin: 4vw 0vw 1vw 0vw;
`

const Adventurer = styled.div`
    display: flex;
    padding: 0vw 1vw;
    margin-top: 1vw;
    width: 100%;
    z-index: 2;
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

const StyledQuestLabelLevel = styled(QuestLabelLevel)`
    right: 1vw;
`

const  CornerRightDown = styled.div`
    position: absolute;
    right: 1vw;
    top: 33vw;
    z-index: 0;

`

interface QuestPaperAvailableProps {
    className?: string,
    quest?: AvailableQuest
    selectedAdventurers: string[],
    onSign?: () => void,
    onClose?: () => void,
}

const QuestCard = ({ className, quest, selectedAdventurers, onSign, onClose }: QuestPaperAvailableProps) =>
    <BackShadow 
        onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose() }} 
        open={quest !== undefined} 
        className={className}>

        {notEmpty(quest) ?
            <CardContainer>
                <CrispPixelArtBackground
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png"
                    alt="paper prop"
                    layout="fill"
                />

                <StyledQuestLabelLevel>1</StyledQuestLabelLevel>
                <Title>{quest.name}</Title>
                <Details dangerouslySetInnerHTML={{ __html: quest.description }} />
                <Monster>
                    <CrispPixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                        alt="quest monster"
                        layout="fill"
                    />
                </Monster>
                <StyledSuccessChance percentage={0} />

                <ProgressionWrapper>
                    <ProgressionQuest />
                </ProgressionWrapper>

                <Adventurer>
                    {Array(quest.slots).fill(('') as any).map((el, index) => {
                        return <DropBox
                            key={index}
                            index={index}
                            questLevel={1}
                            id={selectedAdventurers[index]}
                        />
                    })}
                </Adventurer>
                <CornerRightDown>
                    <Seals seal="kings_plea" />
                </CornerRightDown>

                <Signature questType="available" onClick={onSign} />
            </CardContainer>
            : <></>}
    </BackShadow>

export default QuestCard
