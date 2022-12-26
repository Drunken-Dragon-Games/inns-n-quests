import styled from "styled-components"
import { useGetLevel } from "../../hooks"
import { TextOswald } from "../../../../../../utils/components/basic_components"

const LevelComponent = styled.div`
    font-size: 0.7vw;
    color: white;
    font-weight: 800;
    font-family: arial;
`


interface Level {
    experience: number
}
const Level = ({experience}: Level) : JSX.Element =>{

    const [level, levelBar] = useGetLevel(experience)

    return(<>
        <LevelComponent>
            <TextOswald fontsize={0.7} color="white" >LEVEL {level.toString()}</TextOswald>
        </LevelComponent>
    </>)
}

export default Level