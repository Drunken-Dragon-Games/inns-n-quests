import styled from "styled-components";
import { ConditionalRender } from '../../../../../../utils/components/basic_components';
import { TakenQuest } from "../../../../../dsl";
import TakenQuestCard from "./taken-quest-card";

const InProgressListContainer = styled.div`
    width: 100%;
    padding: 0 0.5vmax;
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-direction: column;
    align-items: center;
    gap: 0.1vmax;

    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 1;

    ::-webkit-scrollbar {
        width: 0.4vmax; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vmax solid transparent;
        border-right: 0.1vmax solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vmax solid rgba(0, 0, 0, 0);
        border-right: 0.5vmax  solid #8A8780;
        border-bottom: 0.3vmax  solid rgba(0, 0, 0, 0);;
        border-left: 0.5vmax  solid #8A8780;
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