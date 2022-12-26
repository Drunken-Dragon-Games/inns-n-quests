import styled, {keyframes} from "styled-components";
import { TextElMessiri } from '../../../../../../utils/components/basic_components';


const QuestTypeButtonComponent = styled.div`
    border: none;
    cursor: pointer;
    &:hover{
        color: white !important;
    }
`

const glow = keyframes`
    100% {text-shadow: 0 0 1px rgba(255, 255, 255, 0.2), 0 0 2px rgba(255, 255, 255, 0.2), 0 0 3px rgba(255, 255, 255, 0.2), 0 0 4px rgba(255, 255, 255, 0.2), 0 0 5px rgba(255, 255, 255, 0.2), 0 0 6px rgba(255, 255, 255, 0.2); }
`
interface TextQuestInProgress{
    glowing: boolean
}

const TextQuestInProgress = styled.div<TextQuestInProgress>`

    p{
        ${props => props.glowing  ? "color: #C58E31 !important;": ""}
        animation: ${props => props.glowing  ?  glow : ""} 0.5s ease-in-out infinite alternate;
    }
`

interface QuestTypeButton{
    children: string | string []
    selected: boolean
    action: () => void
    glowCondition?: boolean
}
const QuestTypeButton = ({children, selected, action, glowCondition}: QuestTypeButton): JSX.Element =>{

    return(<>
        <QuestTypeButtonComponent onClick={action}>
            <TextQuestInProgress glowing = {glowCondition ?? false}>
                <TextElMessiri fontsize={0.8} color={selected  ? "white": "#5B646C"}>{children}</TextElMessiri>
            </TextQuestInProgress>
        </QuestTypeButtonComponent>
    </>)
}


export default QuestTypeButton