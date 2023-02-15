import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { cardano_network } from "../../../../setting"
import { ConditionalRender } from "../../../utils/components/basic_components"
import { Adventurer, SelectedQuest, TakenQuest } from "../../dsl"
import AdventurerList from "./adventurer-list"
import BigHopsButton from "./big-hops-button"
import ConsoleTabs, { TabNames } from "./console-tabs"
import DragonSilverDisplay from "./dragon-silver-display"
import InProgressList from "./in-progress-list"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`

const InventoryContainer =styled.div<{ open: boolean }>`
    width: 15vw;
    height: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(20,33,44,0.9);
    z-index: 5;
    box-shadow: 0 0.5vmax 1.5vmax 0 rgba(0, 0, 0, 0.8), 0 1vmax 3vmax 0 rgba(0, 0, 0, 0.19);
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

interface ConsoleProps {
    adventurers: Adventurer[],
    takenQuests: TakenQuest[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    dragonSilver: number,
    dragonSilverToClaim: number,
    onAdventurerClick: (adventurer: Adventurer) => void
    onAdventurerRecruit: () => void
    onSelectTakenQuest: (takenQuest: TakenQuest) => void
}

const Inventory = ({ adventurers, adventurerSlots, selectedQuest, takenQuests, dragonSilver, dragonSilverToClaim, onAdventurerClick, onAdventurerRecruit, onSelectTakenQuest }: ConsoleProps) => {
    const [page, setPage] = useState<TabNames>("inventory")
    return(
        <InventoryContainer open={true}>
            <DragonSilverDisplay 
                dragonSilver={dragonSilver}
                dragonSilverToClaim={dragonSilverToClaim}
            />
            <ConsoleTabs
                activeTab={page}
                completedQuests={takenQuests.length}
                onTabClick={(page) => setPage(page)}
            />
            <ConditionalRender condition={page == "inventory"}>
                <ConditionalRender condition={cardano_network() == 0}>
                    <BigHopsButton onClick={onAdventurerRecruit} text="Recruit" />
                </ConditionalRender>
                <AdventurerList
                    adventurers={adventurers}
                    adventurerSlots={adventurerSlots}
                    onAdventurerClick={onAdventurerClick}
                    selectedQuest={selectedQuest}
                />
            </ConditionalRender>
            <ConditionalRender condition={page == "quests-in-progress"}>
                <InProgressList 
                    takenQuests={takenQuests}
                    onSelectTakenQuest={onSelectTakenQuest} 
                />
            </ConditionalRender>
        </InventoryContainer>
    )
}

export default Inventory