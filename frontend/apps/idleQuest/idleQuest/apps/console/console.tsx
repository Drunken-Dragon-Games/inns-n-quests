import styled from "styled-components";
import Image from 'next/image'
import { QuestButtonsContainer, Navbar, Pages, AdventurerList, InProgressQuestMapping } from "./components/complex"
import { Adventurer } from "../../../dsl";
import { useGeneralSelector } from "../../../../../features/hooks";
import { selectGeneralReducer } from "../../../../../features/generalReducer";
import { ConditionalRender } from "../../../../utils/components/basic_components";

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
    availableQuestOpen: boolean,
    onAdventurerClick: (adventurer: Adventurer) => void
}

const Console = ({ adventurers, adventurerSlots, availableQuestOpen, onAdventurerClick }: ConsoleProps) => {
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const page = generalSelector.idleQuests.navigationConsole.page
    return(<>
        <AdventuresConsoleContainer>
            <ImageWrapper>
                <div>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/adventurers_console.png"  alt="ornament" width={300} height={700} />
                </div>
            </ImageWrapper>

            <PaddingVertical>
                <Navbar/>
                <QuestButtonsContainer/>

                <ConditionalRender condition={ page == "available" }>
                    <AdventurerList
                        adventurers={adventurers}
                        adventurerSlots={adventurerSlots}
                        onAdventurerClick={onAdventurerClick} 
                        availableQuestOpen={availableQuestOpen}
                    />
                </ConditionalRender>

                <ConditionalRender condition={ page == "in_progress"}>
                    <InProgressQuestMapping/>
                </ConditionalRender>
            </PaddingVertical>
        </AdventuresConsoleContainer>
    </>)
}

export default Console