import { useSelector } from "react-redux"
import styled from "styled-components"
import _ from "underscore"
import { useIsMobile } from "../../../../../../is-mobile"
import { AnimatedText, Character, Medal, notEmpty, PixelArtCss, PixelArtImage, PixelFontFamily, Push, rules, takenQuestSecondsLeft, Units, vh1, vw1 } from "../../../../../../common"
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
    display: flex;
    flex-direction: column;
    gap: 1.8vh;
    z-index: 20;
    filter: drop-shadow(0px 0px 1vh rgba(0, 0, 0, 0.8));
    background: url(https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/pergamino_base.png);
    background-size: cover;
    color: #793312;
    font-size: 21px;
    ${PixelArtCss}
    ${PixelFontFamily}

    @media (min-width: 1025px) {
        height: 90vh;
        width: 79vh;
        max-width: calc(100vw - 500px);
        padding: 8vh;
    }

    @media (max-width: 1024px) {
        height: 100%;
        width: 100%;
        padding: 7vw;
    }
`

const CloseButton = styled(Medal)`
    position: absolute;
    color: rgba(240,240,240);
    background-color: #793312;
    border-radius: 50%;
    filter: drop-shadow(0 0 0.3vh black);
    font-weight: bold;

    @media (min-width: 1025px) {
        right: 0;
        top: 0;
        height: 2.6vh;
        width: 2.6vh;
        font-size: 1.5vh;
    }

    @media (max-width: 1024px) {
        right: 2vw;
        top: 2vw;
        height: 7vw;
        width: 7vw;
        font-size: 4vw;
    }
`

const QuestInfo = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;

    @media (min-width: 1025px) {
        gap: 2vh;
    }

    @media (max-width: 1024px) {
        gap: 4vw;
    }
`

const QuestInfoLeft = styled.div`
    height: 100%;
    flex: 3;
    display: flex;
    flex-direction: column;

    @media (min-width: 1025px) {
        gap: 2vh;
    }

    @media (max-width: 1024px) {
        gap: 4vw;
    }
`

const QuestInfoRight = styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Title = styled.h2`
    font-weight: 900;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
    text-align: center;

    @media (min-width: 1025px) {
        font-size: 3.5vh;
    }

    @media (max-width: 1024px) {
        font-size: 6vw;
    }
`

const Description = styled.p`
    width: 100%;
    text-align: justify;
    color: #793312;
    font-weight: 100;

    @media (min-width: 1025px) {
        font-size: 2vh;
        line-height: 2vh;
    }

    @media (max-width: 1024px) {
        font-size: 4vw;
        line-height: 4vw;
    }
`

const SealImage = styled(PixelArtImage)<{ offset: string }>`
    margin-top: ${props => props.offset};
`

const Footer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;

    @media (min-width: 1025px) {
        height: 10vh;
    }

    @media (max-width: 1024px) {
        height: 12vw;
    }
`

const printOutcome = (outcome: vm.StakingQuestOutcome) => {
    switch (outcome.ctype) {
        case "failure-outcome": return "Failed"
        case "success-outcome": return "Success"
    }
}

type QuestSheetState = {
    isMobile: boolean
    title: string
    party: (Character | null)[]
    signatureType: "in-progress" | "finished" | "claimed" | "available-no-adventurers" | "available"
    configuration: StakingQuestConfiguration
    accumulatedAPS: vm.APS
    claimed: boolean
    sealImage: { src: string, width: number, height: number, offset: number, units: Units }
}

const useQuestCardState = (quest: SelectedQuest): QuestSheetState => {
    const isMobile = useIsMobile()
    const party = useSelector((state: InventoryState) => state.selectedParty, _.isEqual)
    return {
        isMobile,
        party,
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
            mapSealImage(quest, isMobile)
    }
}

const QuestSheet = ({ quest }: { quest: SelectedQuest }) => {
    const state = useQuestCardState(quest)
    return (
        <QuestSheetContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton 
                onClick={() => InventoryTransitions.closeActivity()}
                onTouchEnd={() => InventoryTransitions.closeActivity()}
            >X</CloseButton>
            <QuestInfo>
                <QuestInfoLeft>
                    <Title><AnimatedText text={state.title} duration={1000} animate={state.title == "Success" || state.title == "Failed"} /></Title>
                    <Description dangerouslySetInnerHTML={{ __html: questDescription(quest) }} />
                    <RewardView configuration={state.configuration.configurations[state.configuration.bestIndex]} claimed={state.claimed} />
                </QuestInfoLeft>

                <QuestInfoRight>
                    <PixelArtImage
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/monster.svg"
                        alt="quest monster"
                        width={state.isMobile ? 40 : 25} height={state.isMobile ? 40 : 25}
                        units={state.isMobile ? vw1 : vh1}
                    />
                    {/*<APSReq apsAccumulated={state.apsAccumulated} apsRequired={state.apsRequired} /> */}
                </QuestInfoRight>
            </QuestInfo>

            <StakingQuestRequirementsView isMobile={state.isMobile} configuration={state.configuration} accumulatedAPS={state.accumulatedAPS} claimed={state.claimed} />
            <Push />
            <PartyView isMobile={state.isMobile} quest={quest} adventurerSlots={state.party} />

            <Footer>
                <Signature
                    isMobile={state.isMobile}
                    signatureType={state.signatureType}
                    onClick={InventoryTransitions.onSignQuest}
                />
                <Push/>
                <SealImage 
                    offset={state.sealImage.units.u(state.sealImage.offset)}
                    src={state.sealImage.src}
                    alt="Quest Seal"
                    width={state.sealImage.width}
                    height={state.sealImage.height}
                    units={state.sealImage.units}
                />
            </Footer>
        </QuestSheetContainer>
    )
}

export default QuestSheet
