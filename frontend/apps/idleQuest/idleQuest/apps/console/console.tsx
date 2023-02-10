import styled from "styled-components";
import Image from 'next/image'
import { Navbar, AdventurerList, InProgressList, ConsoleTabs } from "./components/complex"
import { Adventurer, SelectedQuest, TakenQuest } from "../../../dsl";
import { ConditionalRender } from "../../../../utils/components/basic_components";
import { TabNames } from "./components/complex/console-tabs";
import { useState } from "react";

const AdventuresConsoleContainer =styled.div`
    width: 15%;
    height: 100vh;
    background-color: #14212C;
    z-index: 0;
    position: relative;
`

const ImageWrapper = styled.div`
    position: absolute;
    z-index: -1;
    display: flex;
    width: 100%;
    height: 100%;

    div{
        margin: auto;
    }

    img{
        width: 16vw !important;
        height: 36vw !important;
    }
`

const PaddingVertical = styled.div`
    padding: 0vw 0px 2vw 0vw;
`

interface ConsoleProps {
    adventurers: Adventurer[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    takenQuests: TakenQuest[],
    onAdventurerClick: (adventurer: Adventurer) => void
}

const Console = ({ adventurers, adventurerSlots, selectedQuest, takenQuests, onAdventurerClick }: ConsoleProps) => {
    const [page, setPage] = useState<TabNames>("inventory")
    return(<>
        <AdventuresConsoleContainer>
            <ImageWrapper>
                <div>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/adventurers_console.png"  alt="ornament" width={300} height={700} />
                </div>
            </ImageWrapper>

            <PaddingVertical>
                <Navbar/>
                <ConsoleTabs
                    page={page}
                    completedQuests={takenQuests.length} 
                    onTabClick={(page) => setPage(page)}
                />

                <ConditionalRender condition={ page == "inventory" }>
                    <AdventurerList
                        adventurers={adventurers}
                        adventurerSlots={adventurerSlots}
                        onAdventurerClick={onAdventurerClick} 
                        selectedQuest={selectedQuest}
                    />
                </ConditionalRender>

                <ConditionalRender condition={ page == "quests-in-progress"}>
                    <InProgressList/>
                </ConditionalRender>
            </PaddingVertical>
        </AdventuresConsoleContainer>
    </>)
}

export default Console