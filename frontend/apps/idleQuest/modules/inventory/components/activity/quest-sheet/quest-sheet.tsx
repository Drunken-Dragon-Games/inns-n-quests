import { useMemo } from "react"
import styled from "styled-components"
import { Character, notEmpty, PixelArtCss, PixelArtImage, PixelFontFamily, Push, takenQuestSecondsLeft, vh1 } from "../../../../../common"
import * as vm from "../../../../../game-vm"
import { getQuestAPSRequirement, mapSealImage, questDescription, questName, SelectedQuest } from "../../../inventory-dsl"
import InventoryTransitions from "../../../inventory-transitions"
import EncounterView from "./encounter-view"
import PartyView from "./party-view"
import RewardView from "./reward-view"
import Signature from "./signature"

const QuestSheetContainer = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 79vh;
    max-width: calc(100vw - 500px);
    height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 1.8vh;
    padding: 8vh;
    z-index: 20;
    filter: drop-shadow(0px 0px 1vh rgba(0, 0, 0, 0.8));
    background: url(https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png);
    background-size: cover;
    color: #793312;
    font-size: 21px;
    ${PixelArtCss}
    ${PixelFontFamily}
`

const QuestInfo = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2vh;
    width: 100%;
    flex: 1;
`

const QuestInfoLeft = styled.div`
    height: 100%;
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 2vh;
`

const QuestInfoRight = styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Title = styled.h2`
    font-size: 3.5vh;
    font-weight: 900;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
    text-align: center;
`

const Details = styled.p`
    width: 100%;
    font-size: 2vh;
    text-align: justify;
    color: #793312;
    line-height: 2vh;
    font-weight: 100;
`

const SealImage = styled.div<{ offset: number }>`
    margin-top: ${props => props.offset}vh;
`

const Footer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 10vh;
`

type QuestSheetState = {
    signatureType: "in-progress" | "finished" | "claimed" | "available-no-adventurers" | "available"
    apsRequired: vm.APS
    apsAccumulated: vm.APS
    sealImage: { src: string, width: number, height: number, offset: number }
}

const useQuestCardState = (quest: SelectedQuest, adventurerSlots: (Character | null)[]): QuestSheetState => 
    useMemo<QuestSheetState>(() => ({
        signatureType: 
            quest.ctype == "available-staking-quest" && adventurerSlots.filter(notEmpty).length > 0 ? "available" : 
            quest.ctype == "available-staking-quest" ? "available-no-adventurers" : 
            quest.ctype == "taken-staking-quest" && quest.claimedAt ? "claimed" :
            quest.ctype == "taken-staking-quest" && takenQuestSecondsLeft(quest) <= 0 ? "finished" : 
            "in-progress",
        apsRequired: 
            getQuestAPSRequirement(quest),
        apsAccumulated: 
            adventurerSlots.filter(notEmpty).reduce((acc, character) =>
                vm.apsAdd(acc, character.evAPS), vm.zeroAPS),
        sealImage: 
            mapSealImage(quest)
    }), [quest, adventurerSlots])

interface QuestSheetProps {
    className?: string,
    quest: SelectedQuest, 
    adventurerSlots: (Character | null)[],
}

const QuestSheet = ({ className, quest, adventurerSlots }: QuestSheetProps) => {
    if (!quest) return <></>
    const state = useQuestCardState(quest, adventurerSlots)
    return (
        <QuestSheetContainer className={className}>
            <QuestInfo>
                <QuestInfoLeft>
                    <Title>{questName(quest)}</Title>
                    <Details dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                    {quest.ctype == "available-encounter" ?
                        <EncounterView encounter={quest} party={adventurerSlots.filter(notEmpty)} />
                    : <></> }
                    <RewardView quest={quest} />
                </QuestInfoLeft>

                <QuestInfoRight>
                    <PixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                        alt="quest monster"
                        width={25} height={25}
                        units={vh1}
                    />
                    {/*<APSReq apsAccumulated={state.apsAccumulated} apsRequired={state.apsRequired} /> */}
                </QuestInfoRight>
            </QuestInfo>

            <Push />
            <PartyView quest={quest} adventurerSlots={adventurerSlots} />

            <Footer>
                <Signature
                    signatureType={state.signatureType}
                    onClick={InventoryTransitions.onSignQuest}
                />
                <Push/>
                <SealImage offset={state.sealImage.offset}>
                    <PixelArtImage
                        src={state.sealImage.src}
                        alt="quest seal"
                        width={state.sealImage.width}
                        height={state.sealImage.height}
                        units={vh1}
                    />
                </SealImage>
            </Footer>
        </QuestSheetContainer>
    )
}

export default QuestSheet
