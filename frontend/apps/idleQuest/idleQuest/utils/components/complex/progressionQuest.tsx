
import { RescalingProgression,
        RescalingChest,
        CoinReward } from "../basic_component";
import styled, { keyframes} from "styled-components"
import Image from 'next/image'
import { useGetTimeLeft, useGetPuntDistance, useGetMarkTimeLeft } from "../../hooks";
import { useDispatch, useSelector} from 'react-redux'
// import { PostClaimInProgressQuest } from "../../features/inProgressQuest";
// import { selectGeneralPageReducer} from '../../features/generalPage';
import { useState } from "react"
import { ConditionalRender } from "../../../../../utils/components/basic_components";



const PositionWrapper = styled.div`
    position: relative;
    width: 35vw;
    height: 7vw;
    margin-left: 1.7vw;
`

const FirstPunt = styled.div`

    position: absolute;
    bottom: -0.1vw;
    left: 3.5vw;
    img{
        width: 0.7vw !important;
        height: 0.7vw !important;
    }
`

const LastPunt = styled.div`

    position: absolute;
    bottom: -0.1vw;
    left: 22vw;
    img{
        width: 0.7vw !important;
        height: 0.7vw !important;
    }

`

interface GeneralPunt {
    distanceLeft: any,
}

const GeneralPunt = styled.div<GeneralPunt>`

    position: absolute;
    bottom: -0.1vw;
    left: ${props => props.distanceLeft}vw;
    img{
        width: 0.7vw !important;
        height: 0.7vw !important;
    }

`

const ProgressionMarkFirst = styled.div`
    position: absolute;
    bottom: -0.7vw;
    left: 3vw;
    img{
        width: 2vw !important;
        height: 2vw !important;
    }

`

interface GeneralProgressionMark {
    distanceLeft: any,
}

const GeneralProgressionMark = styled.div <GeneralProgressionMark>`
    position: absolute;
    bottom: -0.7vw;
    left: ${props => props.distanceLeft}vw;

    img{
        width: 2vw !important;
        height: 2vw !important;
    }

`
interface ChestWrapper{
    onClick: any
    successful: boolean
}


const ChestWrapper = styled.div<ChestWrapper>`
    position: absolute;
    top: 0vw;
    left: 22.5vw;
    width: 13vw;
    height: 7vw;
    z-index: 7;
    ${props => props.successful ? "cursor: pointer;" : null}
`

const ChestMarkWrapper = styled.div`
    position: absolute;
    top: 0vw;
    left: 25vw;
    cursor: pointer;
    z-index: 7;
    img{
        width: 8vw !important;
        height: 8vw !important;
    }
`



const ShiningCircleWrapper = styled.div`
    width: 30vw;
    height: 30vw;
    top: -11vw;
    left: 14vw;
    position: absolute;
    z-index: 6;
    transform: rotate(45deg);
    img{
        width: 30vw !important;
        height: 30vw !important;
    }
`

const shine_2 = keyframes`
    0% { opacity: 0.3; transform: rotate(360deg);}
    25%{ opacity: 1;}
    50%{ opacity: 0.3;}
    75%{ opacity: 1;}
    100% { opacity: 0.3; transform: rotate(0deg);}
`

const ShiningLightSmall = styled.div`
    width: 20vw;
    height: 20vw;
    top: -6vw;
    left: 19vw;
    position: absolute;
    z-index: 6;
    transform: rotate(45deg);
    img{
        width: 20vw !important;
        height: 20vw !important;
    }

    animation: ${shine_2} 3s infinite linear;
`

const ShiningLightBig = styled.div`
    width: 20vw;
    height: 20vw;
    top: -6vw;
    left: 19vw;
    position: absolute;
    z-index: 6;
    transform: rotate(45deg);
    img{
        width: 20vw !important;
        height: 20vw !important;
    }

    animation: ${shine_2} 3s infinite linear;
`

const CoinRewardWrapper = styled.div`
    position: absolute;
    top: 3.5vw;
    right: 2.5vw;
`


interface ProgressionQuest {

    startTime: any
    duration: any
    inProgress?: boolean
    questState?: "failed" | "succeeded" | "in_progress" | null
    selected?: any
    dsReward: number

}

const ProgressionQuest = ({startTime, duration, inProgress, questState, selected, dsReward}: ProgressionQuest) => {

    // const [ timeLeft, completeDuration ] = useGetTimeLeft(startTime, duration)    

    // const [ distance, numberOfPunts, slots ] = useGetPuntDistance( completeDuration, 2, 18.5)

    // const [ timeMarkLeft ] = useGetMarkTimeLeft( (timeLeft as number), (completeDuration as number), 2)

    // const [ isClaimed, setIsClaimed ] = useState<boolean>(false)

    // const dispatch = useDispatch()

    // const generalSelector = useSelector(selectGeneralPageReducer)

    // const index = generalSelector.navigator.inProgressQuestSelected
    let isSuccessful : boolean = false;
    // if(index !== null){
    //     isSuccessful = generalSelector.inProgress.data[index].state == "succeeded"
    // }


    // const ClaimQuest = () =>{

    //     setIsClaimed(true)
    //     if(isClaimed == false ){

    //         // dispatch(PostClaimInProgressQuest(selected) as any)

    //     }
    // }

    return (<>
                {/* <PositionWrapper>
                    <RescalingProgression src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/progression.svg" /> */}
                    {/* FIXME: arreglo */}
                    {/* <ChestWrapper onClick= {isSuccessful == true ? ClaimQuest : null} successful={isSuccessful} >
                        <RescalingChest src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_progression.svg"/>
                        <CoinRewardWrapper>
                            <CoinReward>{dsReward.toString()}</CoinReward>
                        </CoinRewardWrapper>
                    </ChestWrapper>

                    <FirstPunt>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/progression_punt.png"  alt="punt image" width={2000} height={1250} />
                    </FirstPunt>

                    <ConditionalRender condition = {inProgress == true}>
                        <ProgressionMarkFirst>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/progresion_mark.png"  alt="punt image" width={2000} height={1250} />
                        </ProgressionMarkFirst>
                    </ConditionalRender>


                    <ConditionalRender condition = {questState == "succeeded"}>
                        <>
                            <ShiningCircleWrapper>
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/claim_quest_animation/ligth_circle.webp"  alt="punt image" width={2000} height={1250} />
                            </ShiningCircleWrapper>
                            <ShiningLightSmall>
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/claim_quest_animation/ligth_shine_small.webp"  alt="punt image" width={2000} height={1250} />
                            </ShiningLightSmall>
                            <ShiningLightBig>
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/claim_quest_animation/ligth_shine_big.webp"  alt="punt image" width={2000} height={1250} />
                            </ShiningLightBig>
                        </>
                    </ConditionalRender>


                    <ConditionalRender condition = {questState == "failed"}>
                        <ChestMarkWrapper onClick={ClaimQuest}>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_mark_fail.png"  alt="punt image" width={2000} height={1250} />
                        </ChestMarkWrapper>
                    </ConditionalRender>


                    <LastPunt>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/progression_punt.png"  alt="punt image" width={2000} height={1250} />
                    </LastPunt>


                    <ConditionalRender condition = {numberOfPunts > 0}>
                        { (slots as string[]).map((el: string, index: number) => {

                        const distanceTracker = 3.5 + ((distance as number) * (index + 1))

                        return (
                                <GeneralPunt key={index} distanceLeft ={distanceTracker}>
                                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/progression_punt.png"  alt="punt image" width={2000} height={1250} />
                                </GeneralPunt>)
                        })}
                    </ConditionalRender>


                    <ConditionalRender condition = {numberOfPunts > 0}>
                        {  (slots as string[]).map((el: string, index: number) => {

                                const distanceTracker = 3 + ((distance as number) * (index + 1))

                                if(timeMarkLeft > (index)){
                                    return (
                                        <GeneralProgressionMark distanceLeft={distanceTracker} key ={index} >
                                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/progresion_mark.png"  alt="punt image" width={2000} height={1250} />
                                        </GeneralProgressionMark>)
                                }
                                return <></>
                            })
                        }

                    </ConditionalRender>
                </PositionWrapper> */}

    </>)
}

export default ProgressionQuest
