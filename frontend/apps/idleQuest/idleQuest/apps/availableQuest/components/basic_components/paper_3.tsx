import styled, {keyframes} from "styled-components";
import Image from 'next/image'
import {  useState } from "react"
import { useSetWidthAndHeight, useCloseProps } from "../../hooks";
import { PropStamp } from "."
import { RescalingMonster } from "../../../../utils/components/basic_component";

const Placeit = keyframes`
    0% { height: 0vw;  }
    100% {height: 14vw; }
`

const UnRollAnimation = keyframes`
    0% { top: -14vw; height: 14vw }
    100% { top: 14vw; height: 0vw }
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
    width: 14vw;
    height: 14vw;
`

interface CardWrapper{
    isClose: boolean
}


const CardWrapper = styled.div<CardWrapper>`
  
  cursor: pointer;
  width: 14vw;
  height: 14vw;
  overflow: hidden;
  animation: ${Placeit} 0.8s;
`

  interface PaperBackground{
    isClose: boolean
}

const PaperBackground = styled.div<PaperBackground>`
    position: absolute;
    animation: ${UnRollAnimation} 0.8s;
    top: -14vw;
    width: 14vw;
    height: 0vw;
    z-index: 10;
    overflow: hidden;
    img{
        width: 14vw !important;
        height: 14vw !important;
    }

`
const PageWrapper = styled.div`
    position: relative;
    img{
        width: 14vw !important;
        height: 14vw !important;
    }

    h2{
        position: absolute;
        top: 0vw;
        left: 0vw;
        text-align: center;
        width: 14vw; 
        height: 14vw;
        padding: 1.8vw 1.5vw;
        font-family: VT323;
        font-size: 0.9vw;
        color: #793312;
        text-transform: uppercase; 
    }
`

const OnHover = styled.div<Hover>`
    position: absolute;
    top: 0.2vw;
    left: 0.2vw;
    z-index: -1;
    opacity: ${props => props.Hover ? "1" : "0"};
    transition: opacity 0.2s;
    img{
        width: 13.65vw !important;
        height: 13.9vw !important;
    }
`

const MonsterWrapper = styled.div`
    position: absolute;
    top: 5vw;
    left: 5.75vw;
    width: 3vw;
    height: 5.5vw;

`


interface AvailableQuest {
    uiid?: string
    id: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    width?: number
    height?: number
}

interface  PaperProp {
    data: AvailableQuest
    position: number
    onClick: React.MouseEventHandler<HTMLButtonElement>
  }

  interface  Hover {
    Hover: boolean
}


const Paper_3 = ({data, position, onClick}: PaperProp) => {

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
                                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_3_reverse.webp"  alt="paper prop" width={2000} height={1250} />
                        </PaperBackground>
                        <CardWrapper isClose = {isClose}>
                            <PageWrapper>
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_3.webp"  alt="paper prop" width={2000} height={1250} />

                                <OnHover Hover={onHover} >
                                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_3_onhover.webp"  alt="paper prop" width={2000} height={1250} />
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

export default Paper_3