import styled from "styled-components"
import { PixelArtImage, vh } from "../../utils"
import InventoryApi from "../inventory/inventory-api"
import { QuestBoardApi } from "../quest-board"

const HudContainer = styled.div`
    position: absolute;
    padding-bottom: 2vh;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
`

const HudButtons = styled.div`
    display: flex;
    gap: 2vh;
    padding: 2vh;
    background-color: rgba(20,20,20,0.5);
    backdrop-filter: blur(5px);
    border-radius: 1vh;
`

const HudButton = styled(PixelArtImage)`
    filter: drop-shadow(0px 0px 15px black);
    &:hover {
        filter: drop-shadow(0px 0px 15px yellow);
        cursor: pointer;
    }
`

const HudView = ({ className }: { className?: string }) =>
    <HudContainer>
        <HudButtons className={className}>
            <HudButton
                onClick={QuestBoardApi.toggleQuestBoard}
                src="https://cdn.ddu.gg/modules/quests/icons/quests-icon.png"
                width={80}
                height={68}
                units={vh(0.15)}
            />
            <HudButton
                onClick={InventoryApi.toggleInventory}
                src="https://cdn.ddu.gg/modules/quests/icons/inventory-icon.png"
                width={80}
                height={68}
                units={vh(0.15)}
            />
        </HudButtons>
    </HudContainer>

export default HudView