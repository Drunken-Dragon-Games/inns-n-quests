import styled, { css } from "styled-components"
import { AnimatedNumberMedal, Medal, NoDragImage, PixelFontFamily, vh1 } from "../../../../../common"
import { StakingQuestRequirementConfiguration } from "../../../../../game-vm"

const RewardViewContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 1vh;
    justify-content: center;
    align-items: center;
    ${PixelFontFamily}
`

const DragonSilverIcon = styled(NoDragImage)`
    image-rendering: auto;
    #filter: drop-shadow(0 0 0.5vh #ffe298);
`

const MedalCss = css`
    height: 2.6vh;
    gap: 0.5vh;
    color: rgba(240,240,240);
    background-color: #793312;
    border-radius: 1.5vh;
    padding: 0 1vh;
    filter: drop-shadow(0 0 0.3vh black);
    font-size: 1.5vh;
`

const InfoMedal = styled(Medal)`
    ${MedalCss}
    background-color: #523f60;
`

const DragonSilverMedal = styled(AnimatedNumberMedal)`
    ${MedalCss}
`

const RewardView = ({ configuration, claimed }: { configuration: StakingQuestRequirementConfiguration, claimed: boolean }) => {
    return (
        <RewardViewContainer>
            <InfoMedal>
                <span>Idle Adventure</span>
            </InfoMedal>
            <DragonSilverMedal amount={claimed ? 0 : configuration.finalReward.currency} animate>
                <DragonSilverIcon
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver.png"
                    alt="dragon silver reward"
                    width={2} height={2}
                    units={vh1}
                />
            </DragonSilverMedal>
        </RewardViewContainer>
    )
}

export default RewardView
