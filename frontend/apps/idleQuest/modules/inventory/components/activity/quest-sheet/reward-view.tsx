import styled, { css, keyframes } from "styled-components"
import { AnimatedNumberMedal, Medal, NoDragImage, notEmpty, PixelFontFamily, vh1 } from "../../../../../common"
import { SelectedQuest } from "../../../inventory-dsl"

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

const RewardView = ({ quest }: { quest: SelectedQuest }) => {
    const reward
        = quest.ctype === "taken-staking-quest" ? 
            { ...quest.availableQuest.reward, ctype: "staking-reward", claimed: notEmpty(quest.claimedAt) }
        : quest.ctype === "available-encounter" ? 
            { ...quest.reward, ctype: "encounter-reward", claimed: false }
        :   { ...quest.reward, ctype: "staking-reward", claimed: false }
    return (
        <RewardViewContainer>
            <InfoMedal>
                <span>{reward.ctype === "staking-reward" ? "Staking Quest" : "Adventure Quest"}</span>
            </InfoMedal>
            <DragonSilverMedal amount={reward.claimed ? 0 : reward.currency} animate={reward.claimed}>
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
