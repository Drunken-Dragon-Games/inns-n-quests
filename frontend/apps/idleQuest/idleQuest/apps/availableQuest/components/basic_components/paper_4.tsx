import styled, {keyframes} from "styled-components";
import Image from 'next/image'
import {  useState } from "react"
import { useSetWidthAndHeight, useCloseProps } from "../../hooks";
import { PropStamp } from "."
import { RescalingMonster } from "../../../../utils/components/basic_component";
import { AvailableQuestType } from "../../../../../../../types/idleQuest";

const Placeit = keyframes`
    0% { height: 0vw;  }
    100% {height: 19vw; }
`

const UnRollAnimation = keyframes`
    0% { top: -19vw; height: 19vw }
    100% { top: 19vw; height: 0vw }
`

interface  CardWrapperAbsolute {
    width: number | null
    height: number | null
    position: number
    onClick: any
    isClose: boolean
  }

const CardWrapperAbsolute = styled.div<CardWrapperAbsolute>`
    position: absolute;
    top: ${props => props.height}vw;
    left: ${props => props.width}vw;
    z-index: ${props => props.position};
    opacity: ${props => props.isClose == true  ? "0": "1"};
    transition: opacity 0.5s;
`

const AnimationWrapperRelative = styled.div`
    position: relative;
    width: 19vw;
    height: 19vw;
`

interface CardWrapper{
    isClose: boolean
}


const CardWrapper = styled.div<CardWrapper>`
  
  cursor: pointer;
  width: 19vw;
  height: 19vw;
  overflow: hidden;
  animation: ${Placeit} 0.8s;
`

  interface PaperBackground{
    isClose: boolean
}

const PaperBackground = styled.div<PaperBackground>`
    position: absolute;
    animation: ${UnRollAnimation} 0.8s;
    top: -19vw;
    width: 19vw;
    height: 0vw;
    z-index: 10;
    overflow: hidden;
    img{
        width: 19vw !important;
        height: 19vw !important;
    }

`

const PageWrapper = styled.div`
    position: relative;
    img{
        width: 19vw !important;
        height: 19vw !important;
    }

    h2{
        position: absolute;
        top: 0vw;
        left: 0vw;
        text-align: center;
        width: 19vw; 
        height: 19vw;
        padding: 2.5vw 1.5vw;
        font-family: VT323;
        font-size: 1.5vw;
        color: #793312;
        text-transform: uppercase; 
    }
`
interface  Hover {
    Hover: boolean
}

const OnHover = styled.div<Hover>`
    position: absolute;
    top: 0.25vw;
    left: 0.35vw;
    z-index: -1;
    opacity: ${props => props.Hover ? "1" : "0"};
    transition: opacity 0.2s;
    img{
        width: 18.3vw !important;
        height: 18.4vw !important;
    }
`

const MonsterWrapper = styled.div`
    position: absolute;
    top: 7vw;
    left: 7.75vw;
    width: 4vw;
    height: 7.5vw;

`

interface  PaperProp {
    data: AvailableQuestType
    position: number
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

const Paper_4 = ({data, position, onClick}: PaperProp) => {
    
    const [onHover, setOnHover] = useState(false)

    const [width, height, widthState, heightState ] = useSetWidthAndHeight(data, position)

    const isClose = useCloseProps(data)

    if(widthState == null && heightState == null ){
        return<></>
    }

    return (
        <>
        <CardWrapperAbsolute 
                    onMouseOver={() => setOnHover(true)}
                    onMouseLeave={() => setOnHover(false)}
                    width ={data.width !== undefined ? widthState : width} 
                    height={data.height !== undefined ? heightState : height} 
                    position={position} 
                    onClick={onClick} 
                    isClose = {isClose}
            >
                <AnimationWrapperRelative>
                    <PaperBackground isClose = {isClose}>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_4_reverse.webp"  alt="paper prop" width={2000} height={1250} />
                    </PaperBackground>
                    <CardWrapper isClose = {isClose}>
                        <PageWrapper>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_4.webp"  alt="amigos" width={2000} height={1250} />
                            <OnHover Hover={onHover} >
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_4_onhover.webp"  alt="paper prop" width={2000} height={1250} />
                            </OnHover>

                            <h2>{data.name}</h2>

                            <MonsterWrapper>
                                <RescalingMonster src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/monsters/monstruo.webp"/>
                            </MonsterWrapper>

                            <PropStamp rarity={data.rarity}/>

                        </PageWrapper>
                    </CardWrapper>
                </AnimationWrapperRelative>
            </CardWrapperAbsolute>
        </>
    )
}

export default Paper_4