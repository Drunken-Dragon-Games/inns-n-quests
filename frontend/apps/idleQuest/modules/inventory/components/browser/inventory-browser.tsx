import { useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import { Character, OswaldFontFamily } from "../../../../common"
import { InventoryPageName } from "../../inventory-dsl"
import { InventoryState } from "../../inventory-state"
import { CharacterInfoCard } from "../character-info"
import InventoryPage from "./inventory-page"
import InventoryHeader from "./inventory-header"

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
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
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
`

const InventoryPagesContainer = styled(InventoryPage)`
    flex: 1;
`

const CharacterInfoCardContainer = styled(CharacterInfoCard)`
    box-sizing: border-box;
    margin: 10px;
`

type InventoryBrowserState = {
    infoCardCharacter?: Character
    open: boolean
    page: InventoryPageName 
    setPage: (page: InventoryPageName) => void
}

const useInventoryBrowserState = (): InventoryBrowserState => {
    const [page, setPage] = useState<InventoryPageName>("characters")
    const state = useSelector((state: InventoryState) => ({
        open: state.open,
        infoCardCharacter: state.activeCharacterInfo
    }), shallowEqual)
    return {...state, page, setPage}
}

const InventoryBrowser = () => {
    const state = useInventoryBrowserState()
    return (
        <InventoryBrowserContainer open={state.open}>
            <InventoryHeader />
            <InventoryTabsContainer>
                <InventoryTab onClick={() => state.setPage("characters")} selected={state.page === "characters"}><span>Adventurers</span></InventoryTab>
                <InventoryTab onClick={() => state.setPage("taken-quests")} selected={state.page === "taken-quests"}><span>Taken Quests</span></InventoryTab>
                <InventoryTab onClick={() => state.setPage("furniture")} selected={state.page === "furniture"}><span>Furniture</span></InventoryTab>
            </InventoryTabsContainer>
            { state.infoCardCharacter ?
                <CharacterInfoCardContainer character={state.infoCardCharacter} />
            : <></>}
            <InventoryPagesContainer page={state.page}/>
        </InventoryBrowserContainer>
    )
}

export default InventoryBrowser
