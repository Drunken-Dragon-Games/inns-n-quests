import styled from "styled-components"
import { Adventurer, SelectedQuest, TakenQuest } from "../../dsl"
import { ConditionalRender } from "../../../utils/components/basic_components"
import ConsoleTabs, { TabNames } from "./console-tabs"
import { useState } from "react"
import { cardano_network } from "../../../../setting"
import BigHopsButton from "./big-hops-button"
import DragonSilverDisplay from "./dragon-silver-display"
import AdventurerList from "./adventurer-list"
import InProgressList from "./in-progress-list"

const ConsoleContainer =styled.div`
    width: 15vmax;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #14212C;
    z-index: 1;
    box-shadow: 0 0.5vmax 1.5vmax 0 rgba(0, 0, 0, 0.8), 0 1vmax 3vmax 0 rgba(0, 0, 0, 0.19);
`

interface ConsoleProps {
    adventurers: Adventurer[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    takenQuests: TakenQuest[],
    dragonSilver: number,
    dragonSilverToClaim: number,
    onAdventurerClick: (adventurer: Adventurer) => void
    onAdventurerRecruit: () => void
    onSelectTakenQuest: (takenQuest: TakenQuest) => void
}

const Console = ({ adventurers, adventurerSlots, selectedQuest, takenQuests, dragonSilver, dragonSilverToClaim, onAdventurerClick, onAdventurerRecruit, onSelectTakenQuest }: ConsoleProps) => {
    const [page, setPage] = useState<TabNames>("inventory")
    return(
        <ConsoleContainer>
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
        </ConsoleContainer>
    )
}

export default Console