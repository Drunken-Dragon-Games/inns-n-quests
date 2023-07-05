import styled from "styled-components"
import { useIsMobile } from "../../../is-mobile"
import { OswaldFontFamily, PixelArtImage, px } from "../../../common"
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

const Letter = styled.div`
    color white;
    ${OswaldFontFamily}
    font-size: 26px;
    filter: drop-shadow(0px 0px 3px black);
`

const HudView = ({ className }: { className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <HudContainer>
            <HudButtons className={className}>
            <HudButton
                    onMouseUp={() => {window.location.href = '/inq'}}
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar/sections/home_hover.svg"
                    width={80}
                    height={68}
                    units={px(0.6)}
                />
                { !isMobile && <Letter> Q </Letter> }
                <HudButton
                    onMouseUp={QuestBoardApi.toggleQuestBoard}
                    src="https://cdn.ddu.gg/modules/quests/icons/quests-icon.png"
                    width={80}
                    height={68}
                    units={px(0.6)}
                />
                <HudButton
                    onMouseUp={InventoryApi.toggleInventory}
                    src="https://cdn.ddu.gg/modules/quests/icons/inventory-icon.png"
                    width={80}
                    height={68}
                    units={px(0.6)}
                />
                { !isMobile && <Letter> B </Letter> }
            </HudButtons>
        </HudContainer>
    )
}

export default HudView