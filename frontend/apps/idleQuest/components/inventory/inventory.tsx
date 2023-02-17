import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { Adventurer, SelectedQuest, TakenQuest } from "../../dsl"
import { InventoryItem } from "../../dsl/inventory"
import { TabNames } from "./console-tabs"
import DragonSilverDisplay from "./dragon-silver-display"
import InventoryBrowser from "./inventory-browser"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`

const InventoryContainer =styled.div<{ open: boolean }>`
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: rgba(20,20,20,0.5);
    backdrop-filter: blur(5px);
    ${props => props.open ? "top: 0;" : "top: -100vh;"}i
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const Header = styled(DragonSilverDisplay)`
    height: 5%;
`

const InventoryBody = styled.div<{ open: boolean }>`
    height: 95%;
    width: 100%;
    display: flex;
    opacity: ${props => props.open ? "1" : "0"};
`

const ActivityContainer = styled.div`
    box-sizing: border-box;
    padding: 2vw;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

interface InventoryProps {
    children?: React.ReactNode,
    open: boolean,
    adventurers: Adventurer[],
    takenQuests: TakenQuest[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    selectedAdventurer?: Adventurer,
    dragonSilver: number,
    dragonSilverToClaim: number,
    onAdventurerRecruit: () => void
    onItemClick: (item: InventoryItem) => void
    onClickClose: () => void
}

const Inventory = (props: InventoryProps) => {
    const [page, setPage] = useState<TabNames>("inventory")
    return(
        <InventoryContainer open={props.open}>
            <Header
                dragonSilver={props.dragonSilver}
                dragonSilverToClaim={props.dragonSilverToClaim}
                onClickClose={props.onClickClose}
                onAdventurerRecruit={props.onAdventurerRecruit}
            />
            <InventoryBody open={props.open}>
                <InventoryBrowser 
                    adventurers={props.adventurers}
                    takenQuests={props.takenQuests}
                    adventurerSlots={props.adventurerSlots}
                    selectedQuest={props.selectedQuest}
                    selectedAdventurer={props.selectedAdventurer}
                    onItemClick={props.onItemClick}
                />
                <ActivityContainer>
                    {props.children}
                </ActivityContainer>
            </InventoryBody>
        </InventoryContainer>
    )
}

export default Inventory