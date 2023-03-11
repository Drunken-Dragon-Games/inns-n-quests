import { useMemo } from "react"
import { shallowEqual, useSelector } from "react-redux"
import styled from "styled-components"
import _ from "underscore"
import { AnimatedText, Character, notEmpty, PixelArtCss, PixelArtImage, PixelFontFamily, Push, rules, takenQuestSecondsLeft, vh1 } from "../../../../../common"
import * as vm from "../../../../../game-vm"
import { addAPS, StakingQuestConfiguration } from "../../../../../game-vm"
import { mapSealImage, questDescription, questName, SelectedQuest } from "../../../inventory-dsl"
import { InventoryState } from "../../../inventory-state"
import InventoryTransitions from "../../../inventory-transitions"
import PartyView from "./party-view"
import RewardView from "./reward-view"
import Signature from "./signature"
import StakingQuestRequirementsView from "./staking-quest-requirements-view"

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

const printOutcome = (outcome: vm.StakingQuestOutcome) => {
    switch (outcome.ctype) {
        case "failure-outcome": return "Failed"
        case "success-outcome": return "Success"
    }
}

type QuestSheetState = {
    quest: SelectedQuest
    title: string
    party: (Character | null)[]
    signatureType: "in-progress" | "finished" | "claimed" | "available-no-adventurers" | "available"
    configuration: StakingQuestConfiguration
    accumulatedAPS: vm.APS
    claimed: boolean
    sealImage: { src: string, width: number, height: number, offset: number }
}

const useQuestCardState = (): QuestSheetState | undefined => {
    const { quest, party } = useSelector((state: InventoryState) => ({
        quest: state.activitySelection,
        party: state.selectedParty
    }), _.isEqual)
    if (!quest || (quest.ctype !== "available-staking-quest" && quest.ctype !== "taken-staking-quest")) return undefined
    return {
        quest: quest,
        party: party,
        title: quest.ctype == "taken-staking-quest" && quest.outcome ? printOutcome(quest.outcome) : questName(quest),
        signatureType: 
            quest.ctype == "available-staking-quest" && party.filter(notEmpty).length > 0 ? "available" : 
            quest.ctype == "available-staking-quest" ? "available-no-adventurers" : 
            quest.ctype == "taken-staking-quest" && quest.claimedAt ? "claimed" :
            quest.ctype == "taken-staking-quest" && takenQuestSecondsLeft(quest) <= 0 ? "finished" : 
            "in-progress",
        configuration: 
            rules.stakingQuest.questConfiguration(quest.ctype == "taken-staking-quest" ? quest.availableQuest : quest, party.filter(notEmpty)),
        accumulatedAPS: 
            party.filter(notEmpty).map(c => c.evAPS).reduce(addAPS, vm.zeroAPS),
        claimed:
            quest.ctype == "taken-staking-quest" && quest.claimedAt ? true : false,
        sealImage: 
            mapSealImage(quest)
    }
}

const QuestSheet = () => {
    const state = useQuestCardState()
    if (!state) return <></>
    return (
        <QuestSheetContainer>
            <QuestInfo>
                <QuestInfoLeft>
                    <Title><AnimatedText text={state.title} duration={1000} animate={state.title == "Success" || state.title == "Failed"} /></Title>
                    <Details dangerouslySetInnerHTML={{ __html: questDescription(state.quest) }} />
                    <RewardView configuration={state.configuration.configurations[state.configuration.bestIndex]} claimed={state.claimed} />
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

            <StakingQuestRequirementsView configuration={state.configuration} accumulatedAPS={state.accumulatedAPS} claimed={state.claimed} />
            <Push />
            <PartyView quest={state.quest} adventurerSlots={state.party} />

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
