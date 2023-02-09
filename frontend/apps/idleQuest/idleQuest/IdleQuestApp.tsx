import styled from "styled-components"
import Console from "./apps/console/console"
import QuestBoard from "./apps/availableQuest/quest-board"
import InProgressQuest from "./apps/inProgressQuests/inProgressQuest"
import { ErrorHandler } from "./utils/components/complex"
import { useLoading } from "./utils/hooks"
import { Loading } from "../../utils/components/basic_components"
import { ConditionalRender } from "../../explorerOfThiolden/explorerOfThioldenPage/components/basic_components"

const Relative = styled.section`
  position: relative;
`

const Flex = styled.div`
    display: flex;
`

const BackGroundPositionAbsolute = styled.section`
    position: absolute;
    z-index: 10;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #0B1015;
`

const IdleQuestApp = (): JSX.Element => {

    const loading = useLoading()
    
    return(<>
            <ConditionalRender condition={loading}>
                <BackGroundPositionAbsolute>
                    <Loading size={8} />
                </BackGroundPositionAbsolute>
            </ConditionalRender>

            <Relative>
                <Flex>
                    <Console/>
                    <QuestBoard/>
                    <InProgressQuest/>
                </Flex>
            </Relative>
            <ErrorHandler />
    </>)
}


export default IdleQuestApp