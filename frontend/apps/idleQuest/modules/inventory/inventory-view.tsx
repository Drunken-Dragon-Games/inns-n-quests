import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { OswaldFontFamily } from "../../common-components"
import { AvailableQuest } from "../../dsl"
import DragonSilverDisplay from "./components/dragon-silver-display"
import InventoryPage, { PageName } from "./components/inventory-page"
import { InventoryItem } from "./inventory-dsl"
import { InventoryState } from "./inventory-state"
import { InventoryTransitions } from "./inventory-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const InventoryContainer = styled.div<{ open: boolean }>`
    position: absolute;
    width: 36vmax;
    height: 100%;
    background-color: rgba(20,20,20,0.5);
    backdrop-filter: blur(5px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const Header = styled(DragonSilverDisplay)`
    height: 5%;
`

const InventoryBrowserContainer = styled.div<{ open: boolean }>`
    height: 95%;
    width: 100%;
    display: flex;
    flex-direction: column;
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const InventoryTabsContainer = styled.div`
    height: 5%;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const InventoryTab = styled.div<{ selected: boolean }>`
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 1vmax;
    justify-content: center;
    cursor: pointer;
    background-color: ${props => props.selected ? "rgba(20,20,20,0.1)" : "rgba(20,20,20,0.5)"};
    color: ${props => props.selected ? "white" : "rgba(200,200,200,0.5)"};
    filter: ${props => props.selected ? "drop-shadow(0px 0px 5px white)" : "none"};
    border-bottom: ${props => props.selected ? "2px solid white" : "2px solid rgba(200,200,200,0.5)"};
    ${OswaldFontFamily}
`

const InventoryPagesContainer = styled.div`
    height: 95%;
    width: 100%;
`

const InventoryBrowser = ({ inventoryState, open, onItemClick }: { inventoryState: InventoryState, open: boolean, onItemClick: (item: InventoryItem) => void }) => {
    const [page, setPage] = useState<PageName>("adventurers")
    return (
        <InventoryBrowserContainer open={open}>
            <InventoryTabsContainer>
                <InventoryTab onClick={() => setPage("adventurers")} selected={page === "adventurers"}><span>Adventurers</span></InventoryTab>
                <InventoryTab onClick={() => setPage("taken-quests")} selected={page === "taken-quests"}><span>Taken Quests</span></InventoryTab>
                <InventoryTab onClick={() => setPage("furniture")} selected={page === "furniture"}><span>Furniture</span></InventoryTab>
            </InventoryTabsContainer>
            <InventoryPagesContainer>
                <InventoryPage inventoryState={inventoryState} page={page} onItemClick={onItemClick} />
            </InventoryPagesContainer>
        </InventoryBrowserContainer>
    )
}

interface InventoryProps {
    className?: string,
    dragonSilver: number,
    dragonSilverToClaim: number,
    inventoryState: InventoryState,
    inventoryTransitions: InventoryTransitions,
    onCloseAvailableQuest: (availableQuest: AvailableQuest) => void
}

const InventoryView = (props: InventoryProps) => {
    //const [page, setPage] = useState<TabNames>("inventory")
    return (
        <InventoryContainer className={props.className} open={props.inventoryState.open}>
            <Header
                dragonSilver={props.dragonSilver}
                dragonSilverToClaim={props.dragonSilverToClaim}
                onClickClose={props.inventoryTransitions.onToggleInventory}
                onAdventurerRecruit={props.inventoryTransitions.onRecruitAdventurer}
            />
            <InventoryBrowser
                inventoryState={props.inventoryState}
                open={props.inventoryState.open}
                onItemClick={props.inventoryTransitions.onItemClick}
            />
        </InventoryContainer>
    )
}

export default InventoryView
