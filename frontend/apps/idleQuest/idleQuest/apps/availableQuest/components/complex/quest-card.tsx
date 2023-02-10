import styled from "styled-components"
import { CrispPixelArtBackground, CrispPixelArtImage, notEmpty } from "../../../../../../utils"
import { Adventurer, questDescription, questName, questSeal, SelectedQuest, takenQuestSecondsLeft } from "../../../../../dsl"
import { QuestLabelLevel, Seals, Signature, SuccessChance } from "../../../../utils/components/basic_component"
import { ProgressionQuest } from "../../../../utils/components/complex"
import { AdventurerSlot } from "../basic_components"

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

const MonsterContainer = styled.div`
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

const AdventurersWrapper = styled.div`
    width: 100%;
    display: flex;
    padding: 0vw 1vw;
    margin-top: 1vw;
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

const Monster = () =>
    <MonsterContainer>
        <CrispPixelArtImage
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
            alt="quest monster"
            layout="fill"
        />
    </MonsterContainer>

interface QuestPaperAvailableProps {
    className?: string,
    quest?: SelectedQuest, 
    adventurerSlots: (Adventurer | null)[],
    onSign?: (selectedQuest: SelectedQuest, adventurers: Adventurer[]) => void,
    onClose?: () => void,
    onUnselectAdventurer?: (adventurer: Adventurer) => void,
}

const QuestCard = ({ className, quest, adventurerSlots, onSign, onClose, onUnselectAdventurer }: QuestPaperAvailableProps) => {
    const signatureType 
        = quest?.ctype == "available-quest" && adventurerSlots.filter(notEmpty).length > 0 
            ? "available" 
        : quest?.ctype == "available-quest" 
            ? "available-no-adventurers"
        : quest?.ctype == "taken-quest" && takenQuestSecondsLeft(quest) <= 0 
            ? "finished"
        : "in-progress"
    return <BackShadow 
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
                <Title>{questName(quest)}</Title>
                <Details dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                <StyledSuccessChance percentage={0} />
                <Monster />

                <ProgressionWrapper>
                    <ProgressionQuest />
                </ProgressionWrapper>

                <AdventurersWrapper>
                    {adventurerSlots.map((adventurer, index) => 
                        <AdventurerSlot 
                            key={"adventurer-slot-"+index} 
                            adventurer={adventurer}
                            onUnselectAdventurer={onUnselectAdventurer}
                        />
                    )} 
                </AdventurersWrapper>
                <CornerRightDown>
                    <Seals seal={questSeal(quest)} />
                </CornerRightDown>

                <Signature 
                    signatureType={signatureType} 
                    onClick={() => notEmpty(quest) && notEmpty(onSign) && onSign(quest, adventurerSlots.filter(notEmpty))} 
                />
            </CardContainer>
            : <></>}
    </BackShadow>
}

export default QuestCard
