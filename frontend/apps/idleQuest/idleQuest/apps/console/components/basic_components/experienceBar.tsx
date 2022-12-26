import styled from "styled-components"
import { useGetLevel } from "../../hooks"

const ExperienceBarComponent = styled.div`
    width: 9vw;
    height: 0.4vw;
    border: 1px solid #7A7976;
    border-radius: 0vw 1vw 0vw 1vw;
    overflow: hidden;
`
interface IProps_Experience{
    experience : number
}

const Experience = styled.div<IProps_Experience>`
    height: 0.3vw;
    background-color: #E7CA83;
    width: ${props => props.experience}%;
    transition: width 1s;
`

interface ExperienceBar{
    experience: number
}
const ExperienceBar = ({experience} : ExperienceBar): JSX.Element =>{

    const [level, levelBar] = useGetLevel(experience)
    return(<>
        <ExperienceBarComponent>
            <Experience experience = {levelBar}/>
        </ExperienceBarComponent>
    
    </>)
}

export default ExperienceBar