import styled from "styled-components"
import { IdleQuestsTransitions } from "../../idle-quests-transitions"
import { PixelArtImage, vh } from "../../utils"

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

interface HudViewProps {
    className?: string,
    transitions: IdleQuestsTransitions
}

const HudView = ({ className, transitions }: HudViewProps) =>
    <HudContainer>
        <HudButtons className={className}>
            <HudButton
                onClick={() => {
                    transitions.world.onToggleWorldMap(false)
                    transitions.questBoard.onToggleQuestBoard()
                }}
                src="https://cdn.ddu.gg/modules/quests/icons/quests-icon.png"
                width={80}
                height={68}
                units={vh(0.15)}
            />
            <HudButton
                onClick={() => {
                    transitions.world.onToggleWorldMap(false)
                    transitions.inventory.onToggleInventory()
                }}
                src="https://cdn.ddu.gg/modules/quests/icons/inventory-icon.png"
                width={80}
                height={68}
                units={vh(0.15)}
            />
            <HudButton
                onClick={() => transitions.world.onToggleWorldMap()}
                src="https://cdn.ddu.gg/modules/quests/icons/map-icon.png"
                width={80}
                height={68}
                units={vh(0.15)}
            />
        </HudButtons>
    </HudContainer>

export default HudView