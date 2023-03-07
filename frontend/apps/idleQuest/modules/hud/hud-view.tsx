import styled from "styled-components"
import { OswaldFontFamily } from "../../common"
import { PixelArtImage, px, vh } from "../../utils"
import InventoryApi from "../inventory/inventory-api"
import { QuestBoardApi } from "../quest-board"

const HudContainer = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
`

const HudButtons = styled.div`
    display: flex;
    gap: 2vh;
    padding: 10px;
`

const HudButton = styled(PixelArtImage)`
    filter: drop-shadow(0px 0px 13px black);
    &:hover {
        filter: drop-shadow(0px 0px 15px yellow);
        cursor: pointer;
    }
`

const Letter = styled.div<{ letter: string }>`
    color white;
    ${OswaldFontFamily}
    font-size: 26px;
    position: absolute;
    filter: drop-shadow(0px 0px 3px black);
    ${props => props.letter === "q" ? "left: 45vw;" : "right: 45vw;"}
`

const HudView = ({ className }: { className?: string }) =>
    <HudContainer>
        <HudButtons className={className}>
            <HudButton
                onClick={QuestBoardApi.toggleQuestBoard}
                src="https://cdn.ddu.gg/modules/quests/icons/quests-icon.png"
                width={80}
                height={68}
                units={px(0.6)}
            />
            <Letter letter="q"> Q </Letter>
            <HudButton
                onClick={InventoryApi.toggleInventory}
                src="https://cdn.ddu.gg/modules/quests/icons/inventory-icon.png"
                width={80}
                height={68}
                units={px(0.6)}
            />
            <Letter letter="b"> B </Letter>
        </HudButtons>
    </HudContainer>

export default HudView