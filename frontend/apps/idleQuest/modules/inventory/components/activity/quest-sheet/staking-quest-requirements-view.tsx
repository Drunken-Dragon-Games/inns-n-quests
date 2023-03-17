import { ReactNode } from "react"
import styled from "styled-components"
import { PixelArtImage, ProgressBar, Push, vh, vw } from "../../../../../common"
import { APS, CharacterCollection, StakingQuestConfiguration, StakingQuestRequirementConfiguration } from "../../../../../game-vm"
import PixelCheckbox from "./pixel-checkbox"

const StakingQuestViewContainer = styled.div`
    width: 100%;
    position: relative;
`

const RequirementsTitle = styled.h2`

    @media (min-width: 1025px) {
        direction: rtl;
        font-size: 2.5vh;
        margin-right: 7vh;
    }

    @media (max-width: 1024px) {
        text-align: center;
        font-size: 4.5vw;
        padding-bottom: 2vw;
    }
`

const ConfigurationsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    @media (min-width: 1025px) {
        font-size: 2.5vh;
        margin-right: 7vh;
        padding-right: 4vh;
        flex-direction: row-reverse;
    }

    @media (max-width: 1024px) {
        position: absolute;
        font-size: 4.5vw;
        justify-content: center;
    }
`

const ConfigurationContainer = styled.div<{ isBest: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    ${ props => !props.isBest && "filter: opacity(50%)" }

    @media (min-width: 1025px) {
        padding: 1vh;
    }

    @media (max-width: 1024px) {
        padding: 1vw;
    }
`

const SuccessChance = styled.div`
    display: flex;
    font-weight: bold;
    align-items: center;

    @media (min-width: 1025px) {
        font-size: 3vh;
    }

    @media (max-width: 1024px) {
        font-size: 7vw;
    }
`

const RequirementBoxContainer = styled.div`
    display: flex;
    align-items: center;

    @media (min-width: 1025px) {
        font-size: 1.5vh;
        width: 17vh;
        gap: 1vh;
    }

    @media (max-width: 1024px) {
        font-size: 4vw;
        width: 35vw;
        gap: 1vw;
    }
`

const APSRequirementProgressBar = styled(ProgressBar)`

    @media (min-width: 1025px) {
        height: 0.8vh;
        width: 8vh;
    }

    @media (max-width: 1024px) {
        height: 2vw;
        width: 17vw; 
    }
`

const RequirementBox = ({ children, checked }: { children?: ReactNode, checked: boolean }) => 
    <RequirementBoxContainer>
        <PixelCheckbox checked={checked} size={vh(1.5)}/>
        {children}
    </RequirementBoxContainer>

const printCollection = (collection: CharacterCollection) => {
    switch (collection) {
        case "pixel-tiles": return "Pixel Tiles"
        case "adventurers-of-thiolden": return "Adventurers of Thiolden"
        case "grandmaster-adventurers": return "Grandmaster Adventurers"
    }
}

interface ConfigurationViewProps {
    isMobile: boolean
    accumulatedAPS: APS
    configuration: StakingQuestRequirementConfiguration
    bestIndex: number
    index: number
    claimed: boolean
}

const ConfigurationView = (props: ConfigurationViewProps) => {
    const apsRequirement = props.configuration.satisfactionInfo.requirement.aps
    const collectionRequirement = props.configuration.satisfactionInfo.requirement.collection
    const collectionSatisfaction = props.configuration.satisfactionInfo.satisfaction.collection == 1
    const classRequirement = props.configuration.satisfactionInfo.requirement.class
    const classSatisfaction = props.configuration.satisfactionInfo.satisfaction.class == 1
    const asseRequirement = props.configuration.satisfactionInfo.requirement.assetRef
    const asseSatisfaction = props.configuration.satisfactionInfo.satisfaction.assetRef == 1
    return (
        <ConfigurationContainer isBest={props.index == props.bestIndex}>
            <SuccessChance>
                <PixelArtImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/clover.svg"
                    alt="success chance clover"
                    width={2} height={1.2}
                    units={props.isMobile ? vw(5) : vh(2)}
                />
                {Math.floor(props.configuration.finalSuccessRate * 100)}%
            </SuccessChance>

            <RequirementBox checked={apsRequirement.athleticism <= props.accumulatedAPS.athleticism}>
                <p>ATH <b>{apsRequirement.athleticism}</b></p>
                <Push />
                <APSRequirementProgressBar maxValue={apsRequirement.athleticism} currentValue={props.accumulatedAPS.athleticism} />
            </RequirementBox>
            <RequirementBox checked={apsRequirement.intellect <= props.accumulatedAPS.intellect}>
                <p>INT <b>{apsRequirement.intellect}</b></p>
                <Push />
                <APSRequirementProgressBar maxValue={apsRequirement.intellect} currentValue={props.accumulatedAPS.intellect} />
            </RequirementBox>
            <RequirementBox checked={apsRequirement.charisma <= props.accumulatedAPS.charisma}>
                <p>CHA <b>{apsRequirement.charisma}</b></p>
                <Push />
                <APSRequirementProgressBar maxValue={apsRequirement.charisma} currentValue={props.accumulatedAPS.charisma} />
            </RequirementBox> 

            {collectionRequirement && (
                <RequirementBox checked={collectionSatisfaction}>
                    <span>{collectionRequirement.map(printCollection).join(" or ")}</span>
                </RequirementBox>
            )}

            {classRequirement && (
                <RequirementBox checked={classSatisfaction}>
                    <span>{classRequirement.map(c => c+"s").join(" or ")}</span>
                </RequirementBox>
            )}

            {asseRequirement && (
                <RequirementBox checked={asseSatisfaction}>
                    <span>{asseRequirement}</span>
                </RequirementBox>
            )}
        </ConfigurationContainer>
    )
}

interface StakingQuestViewProps {
    isMobile: boolean
    configuration: StakingQuestConfiguration
    accumulatedAPS: APS
    claimed: boolean
}

const StakingQuestRequirementsView = (props: StakingQuestViewProps) => 
    <StakingQuestViewContainer>
        { !props.isMobile && <RequirementsTitle>Requirements</RequirementsTitle> }
        <ConfigurationsContainer>
            {props.configuration.configurations.map((c, i) =>
                <ConfigurationView
                    isMobile={props.isMobile}
                    configuration={c}
                    accumulatedAPS={props.accumulatedAPS}
                    bestIndex={props.configuration.bestIndex}
                    index={i}
                    key={i}
                    claimed={props.claimed}
                />
            )}
        </ConfigurationsContainer>
    </StakingQuestViewContainer>

export default StakingQuestRequirementsView
