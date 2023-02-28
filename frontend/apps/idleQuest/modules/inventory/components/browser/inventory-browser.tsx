import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { OswaldFontFamily } from "../../../../common"
import { InventoryPageName } from "../../inventory-dsl"
import { useInventorySelector } from "../../inventory-state"
import InventoryPage from "./inventory-page"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
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

const InventoryBrowser = () => {
    const [page, setPage] = useState<InventoryPageName>("adventurers")
    const open = useInventorySelector(state => state.open)
    return (
        <InventoryBrowserContainer open={open}>
            <InventoryTabsContainer>
                <InventoryTab onClick={() => setPage("adventurers")} selected={page === "adventurers"}><span>Adventurers</span></InventoryTab>
                <InventoryTab onClick={() => setPage("taken-quests")} selected={page === "taken-quests"}><span>Taken Quests</span></InventoryTab>
                <InventoryTab onClick={() => setPage("furniture")} selected={page === "furniture"}><span>Furniture</span></InventoryTab>
            </InventoryTabsContainer>
            <InventoryPagesContainer>
                <InventoryPage page={page} />
            </InventoryPagesContainer>
        </InventoryBrowserContainer>
    )
}

export default InventoryBrowser
