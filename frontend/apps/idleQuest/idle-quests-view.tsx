import styled from "styled-components"
import AlphaNotes from "./alpha-notes"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import { HudView } from "./modules/hud"
import { InventoryView } from "./modules/inventory"
import { NotificationsView } from "./modules/notifications"
import { OverworldView } from "./modules/overworld"
import { QuestBoardView } from "./modules/quest-board"

const IdleQuestsContainer = styled.section`
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
`

const NotificationsModule = styled(NotificationsView)`
    z-index: 40;
`

const HudModule = styled(HudView)`
    z-index: 15;
`

const InventoryModule = styled(InventoryView)`
    z-index: 20;
`

const QuestBoardModule = styled(QuestBoardView)`
    z-index: 10;
`

const OverworldModule = styled(OverworldView)`
    z-index: 1;
`

const IdleQuestsView = () => {
    useIdleQuestsKeyMap()
    return (
        <IdleQuestsContainer>
            <OverworldModule />
            <HudModule />
            <NotificationsModule />
            <QuestBoardModule />
            <InventoryModule /> 
            <AlphaNotes />
        </IdleQuestsContainer>
    )
}

export default IdleQuestsView
