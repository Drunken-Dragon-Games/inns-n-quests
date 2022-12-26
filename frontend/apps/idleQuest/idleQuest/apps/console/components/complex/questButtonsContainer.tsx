import styled from "styled-components";
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import Image from "next/image";
import { QuestTypeButton } from "../basic_components";
import { setPage } from "../../features/navigationConsole";
import { useGetQuestCompleted } from "../../hooks";

const Center = styled.div`
    display: flex;
    width: 100%;
`

const Padding = styled.div`
    width: 90%;
    margin: auto;
`

const ButtonsWrappers = styled.div`
    display: flex;
    position: absolute;
    margin-top: 0.85vw;
`

const ButtonLeft = styled.div`
    margin-left: 2.5vw;
    margin-top: 0vw
`


const ButtonRight = styled.div`
    margin-left: 2.1vw;
    margin-top: 0vw
`

const Flex = styled.div`
    display:flex;
`
const AdventuresCardContainer = styled.div`
    width: 100%;
    height: 3vw;
`


const QuestButtonsContainer = () =>{

    const generalDispatch = useGeneralDispatch()

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const selectedPage = generalSelector.idleQuest.navigationConsole.page

    const inProgressQuest = generalSelector.idleQuest.questsInProgress.data.inProgressQuest.quests

    const questCompletedNumber = useGetQuestCompleted(inProgressQuest)

    return(
        <>
            <AdventuresCardContainer>
                <Flex>
                    <Center>
                        <Padding>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/quest_buttons_container.png"  alt="ornament" width={400} height={75} layout="responsive" />
                        </Padding>
                    </Center>
                
                    <ButtonsWrappers>
                        <ButtonLeft>
                            <QuestTypeButton selected = {selectedPage == "available"} action ={() => generalDispatch(setPage("available"))}>AVAILABLE</QuestTypeButton>
                        </ButtonLeft>
                        <ButtonRight>
                            {/* FIXME: falta agregar el glow condition */}
                            <QuestTypeButton selected = {selectedPage == "in_progress"} action ={() => generalDispatch(setPage("in_progress"))} glowCondition ={questCompletedNumber > 0}>IN PROGRESS</QuestTypeButton>
                        </ButtonRight>
                    </ButtonsWrappers>
                </Flex>
            </AdventuresCardContainer>
    </>)
}

export default QuestButtonsContainer