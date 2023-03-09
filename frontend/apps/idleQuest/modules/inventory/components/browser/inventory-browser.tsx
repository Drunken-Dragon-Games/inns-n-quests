import { shallowEqual, useSelector } from "react-redux"
import styled from "styled-components"
import { OswaldFontFamily } from "../../../../common"
import { InventoryState } from "../../inventory-state"
import InventoryTransitions from "../../inventory-transitions"
import { CharacterInfoCard } from "../character-info"
import InventoryHeader from "./inventory-header"
import InventoryPage from "./inventory-pages"

const InventoryBrowserContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const InventoryTabsContainer = styled.div`
    width: 100%;
    display: flex;
`

const InventoryTab = styled.div<{ selected: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 10px 0;
    justify-content: center;
    cursor: pointer;
    background-color: ${props => props.selected ? "rgba(20,20,20,0.1)" : "rgba(20,20,20,0.5)"};
    color: ${props => props.selected ? "white" : "rgba(200,200,200,0.5)"};
    filter: ${props => props.selected ? "drop-shadow(0px 0px 5px white)" : "none"};
    border-bottom: ${props => props.selected ? "2px solid white" : "2px solid rgba(200,200,200,0.5)"};
    ${OswaldFontFamily}
    ${props => !props.selected && `
        &:hover { border-bottom: 2px solid white; }
        &:hover > span { color: white; filter: drop-shadow(0px 0px 5px white); }
        &:active { border-bottom: 2px solid white; }
        &:active > span { color: white; filter: drop-shadow(0px 0px 5px white); }
    `}
`

const InventoryPagesContainer = styled(InventoryPage)`
    flex: 1;
`

const InventoryTabs = () => {
    const page = useSelector((state: InventoryState) => state.activeInventoryPage, shallowEqual)
    return (
        <InventoryTabsContainer>
            <InventoryTab onClick={() => InventoryTransitions.selectInventoryPage("characters")} selected={page === "characters"}><span>Adventurers</span></InventoryTab>
            <InventoryTab onClick={() => InventoryTransitions.selectInventoryPage("furniture")} selected={page === "furniture"}><span>Furniture</span></InventoryTab>
            <InventoryTab onClick={() => InventoryTransitions.selectInventoryPage("taken-quests")} selected={page === "taken-quests"}><span>Taken Quests</span></InventoryTab>
        </InventoryTabsContainer>
    )
}

const InventoryBrowser = () => {
    return (
        <InventoryBrowserContainer>
            <InventoryHeader />
            <CharacterInfoCard />
            <InventoryTabs />
            <InventoryPagesContainer />
        </InventoryBrowserContainer>
    )
}

export default InventoryBrowser
