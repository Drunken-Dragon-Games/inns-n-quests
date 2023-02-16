import { Children, useState } from "react"
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
    ${props => props.open ? "top: 0;" : "top: -100vh;"}
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const InventoryBody = styled.div<{ open: boolean }>`
    width: 100%;
    height: 100%;
    display: flex;
    opacity: ${props => props.open ? "1" : "0"};
`

const ActivityContainer = styled.div`
    flex: 1;
    display: inline-flex;
    padding: 2vh 0;
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
            <DragonSilverDisplay 
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