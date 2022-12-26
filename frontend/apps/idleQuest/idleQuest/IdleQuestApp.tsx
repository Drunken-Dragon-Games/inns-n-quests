import styled from "styled-components"
import Console from "./apps/console/console"
import AvailableQuests from "./apps/availableQuest/availableQuests"
import InProgressQuest from "./apps/inProgressQuests/inProgressQuest"




const Relative = styled.section`
  position: relative;
`

const Flex = styled.div`
    display: flex;
`

const IdleQuestApp = (): JSX.Element =>{


  
  
    return(<>
            <Relative>
                <Flex>
                    <Console/>
                    <AvailableQuests/>
                    <InProgressQuest/>
                </Flex>
            </Relative>
    </>)
}


export default IdleQuestApp