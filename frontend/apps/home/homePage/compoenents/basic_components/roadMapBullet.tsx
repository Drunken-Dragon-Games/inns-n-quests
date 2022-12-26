import styled from "styled-components"
import { TextOswald, ConditionalRender } from "../../../../utils/components/basic_components"

const RoadMapBulletComponent = styled.div`
    width: 21vw;
    max-width: 450px;
    @media only screen and (max-width: 414px) {
        width: 100%;
    }
`

const Completed = styled.span`
    color: #E6C982;
    font-size: 1.2vw;

    @media only screen and (max-width: 414px) {
        font-size: 4vw;
    }
`

interface roadMapBullet{
    completed?: boolean
    title: string
    children: string
}

const RoadMapBullet = ({ title, children, completed} : roadMapBullet) => {
    return (<>
        <RoadMapBulletComponent>
            <TextOswald fontsize={1.2} color="#CAC6BE" fontsizeMobile={4} lineHeightMobil={5} ><ConditionalRender condition={completed == true}><Completed>(Completed)</Completed></ConditionalRender> {title} </TextOswald>
            <TextOswald fontsize={1} color="#CAC6BE"  fontsizeMobile={3.5} lineHeightMobil={4.5} >{children}</TextOswald>
        </RoadMapBulletComponent>
    
    </>)
}

export default RoadMapBullet