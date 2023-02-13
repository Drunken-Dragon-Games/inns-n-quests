import styled from "styled-components";
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useRef } from "react";
import { ConditionalRender } from '../../../../../../utils/components/basic_components';
import { TakenQuest, takenQuestId } from "../../../../../dsl";
import TakenQuestCard from "./tankenQuestCard";

const InProgressListContainer = styled.div`
    position: relative;
    flex: 1;
    width: 100%;
`

const InProgressMapping = styled.div`
    width: 97%;
    height: 82vh;
    overflow: auto;
    z-index: 1;
    ::-webkit-scrollbar {
        width: 0.4vw; 
      }
      
      /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vw solid transparent;
        border-right: 0.1vw solid transparent;
      }
      
      /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vw solid rgba(0, 0, 0, 0);
        border-right: 0.8vw  solid #8A8780;
        border-bottom: 0.3vw  solid rgba(0, 0, 0, 0);;
        border-left: 0.8vw  solid #8A8780;
      }
      
      /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #585652; 
      }

`

const NoQuestWaring = styled.div`
    display: flex;
    height: 82vh;
    
    div{
        margin: auto;
        font-family: El Messiri;
        color: white;
        font-size: 1.1vw;
    }
`

interface InProgressListProps {
    takenQuests: TakenQuest[]
    onSelectTakenQuest?: (takenQuest: TakenQuest) => void
}

const InProgressList = ({ takenQuests, onSelectTakenQuest }: InProgressListProps) =>
    <InProgressListContainer>
        {takenQuests.map((quest, index) => {
            return <TakenQuestCard takenQuest={quest} onSelectTakenQuest={onSelectTakenQuest} key={"taken-quest-" + index} />
        })}
        <ConditionalRender condition={takenQuests.length == 0}>
            <NoQuestWaring><span>No quests in progress...</span></NoQuestWaring>
        </ConditionalRender>
    </InProgressListContainer>

export default InProgressList