import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { cardano_network } from "../../../../setting"
import { ConditionalRender } from "../../../utils/components/basic_components"
import { Adventurer, SelectedQuest, TakenQuest } from "../../dsl"
import { InventoryItem } from "../../dsl/inventory"
import AdventurerList from "./adventurer-list"
import BigHopsButton from "./big-hops-button"
import ConsoleTabs, { TabNames } from "./console-tabs"
import DragonSilverDisplay from "./dragon-silver-display"
import InProgressList from "./in-progress-list"
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
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(20,20,20,0.5);
    backdrop-filter: blur(5px);
    z-index: 10;
    #box-shadow: 0 0.5vmax 1.5vmax 0 rgba(0, 0, 0, 0.8), 0 1vmax 3vmax 0 rgba(0, 0, 0, 0.19);
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const InventoryBody = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`

interface InventoryProps {
    open: boolean,
    adventurers: Adventurer[],
    takenQuests: TakenQuest[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    dragonSilver: number,
    dragonSilverToClaim: number,
    onAdventurerClick: (adventurer: Adventurer) => void
    onAdventurerRecruit: () => void
    onSelectTakenQuest: (takenQuest: TakenQuest) => void
    onItemClick: (item: InventoryItem) => void
}

const Inventory = (props: InventoryProps) => {
    const [page, setPage] = useState<TabNames>("inventory")
    return(
        <InventoryContainer open={props.open}>
            <DragonSilverDisplay 
                dragonSilver={props.dragonSilver}
                dragonSilverToClaim={props.dragonSilverToClaim}
            />
            <InventoryBody>
                <InventoryBrowser 
                    inventory={(props.adventurers as InventoryItem[]).concat(props.takenQuests)} 
                    onItemClick={props.onItemClick}
                />
            </InventoryBody>
        </InventoryContainer>
    )
}

export default Inventory