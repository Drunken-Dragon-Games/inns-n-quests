import styled from "styled-components"
import { RoadMapBullet } from "./"
import { TitleElMessiri } from "../../../../utils/components/basic_components"
import Image from "next/image"
const RoadMapQComponent = styled.div`
    padding: 0vw 1vw;
    @media only screen and (max-width: 414px) {
        margin-top: 10vw;
        padding: 0vw 7vw;
        position: relative;
    }
`

const TitleQuarter = styled.div`
    margin-bottom: 1vw;

    @media only screen and (max-width: 414px) {
        margin-bottom: 3vw;;
    }
`

const RoadMapBulletWrapper = styled.div`
    margin-bottom: 1vw;

    @media only screen and (max-width: 414px) {
        margin-bottom: 4vw;
    }
`
const CornerMobile = styled.div`
    position: absolute;
    display: none;
    width: 25vw;
    height: 25vw;
    bottom: -2vw;
    right: 6vw;
    transform: rotate(-270deg);
    @media only screen and (max-width: 414px) {
        display: block;
    }
    
`

interface RoadMapQ{
    data: data []
    title: string
}

interface data{
    title: string
    details: string
    completed?: boolean
}
const RoadMapQ = ({data, title} : RoadMapQ) : JSX.Element => {
    return(<>
        <RoadMapQComponent>
            <TitleQuarter>
                <TitleElMessiri fontsize={2} color="#CA9F44" fontsizeMobile={6} lineHeightMobil={7}>{title}</TitleElMessiri>
            </TitleQuarter>

            {data.map(el =>{
                return (
                <RoadMapBulletWrapper key ={el.title}>
                    <RoadMapBullet title={el.title} completed={el.completed}>{el.details}</RoadMapBullet>
                </RoadMapBulletWrapper>
                )
            })}
            <CornerMobile>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/right_corner_rm.svg" width={50} height={50} layout ="responsive"/>
            </CornerMobile>

        </RoadMapQComponent>
    </>)
}

export default RoadMapQ