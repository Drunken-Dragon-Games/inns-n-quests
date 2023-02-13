import styled from "styled-components";
import { Navbar, AdventurerList, InProgressList, ConsoleTabs } from "./components/complex"
import { Adventurer, SelectedQuest, TakenQuest } from "../../../dsl";
import { ConditionalRender } from "../../../../utils/components/basic_components";
import { TabNames } from "./components/complex/console-tabs";
import { useState } from "react";
import { cardano_network } from "../../../../../setting";
import BigHopsButton from "../availableQuest/components/big-hops-button";

const Container =styled.div`
    position: relative;
    width: 15vmax;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #14212C;
    z-index: 0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

interface ConsoleProps {
    adventurers: Adventurer[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    takenQuests: TakenQuest[],
    onAdventurerClick: (adventurer: Adventurer) => void
    onAdventurerRecruit: () => void
}

const Console = ({ adventurers, adventurerSlots, selectedQuest, takenQuests, onAdventurerClick, onAdventurerRecruit }: ConsoleProps) => {
    const [page, setPage] = useState<TabNames>("inventory")
    return(
        <Container>
            <Navbar />
            <ConsoleTabs
                page={page}
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
                <InProgressList />
            </ConditionalRender>
        </Container>
    )
}

export default Console