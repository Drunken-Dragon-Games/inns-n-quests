import styled from "styled-components"
import { useIsMobile } from "../is-mobile"
import AlphaNotes from "./alpha-notes"
import { useIdleQuestsKeyMap } from "./idle-quests-key-map"
import { DragNDropView } from "./modules/drag-n-drop"
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
    height: 100dvh;
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
    const isMobile = useIsMobile()
    if (isMobile && typeof window !== "undefined") window.screen.orientation.lock('landscape')

    useIdleQuestsKeyMap()
    return (
        <IdleQuestsContainer>
            <DragNDropView />
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
