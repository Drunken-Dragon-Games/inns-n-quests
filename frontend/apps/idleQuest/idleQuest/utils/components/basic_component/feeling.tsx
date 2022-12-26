

import styled from "styled-components"
import Image from 'next/image'
import { useGetFeelings } from "../../hooks"
import { ConditionalRender } from "../../../../../utils/components/basic_components"


const FeelingWrapper = styled.div`
    position: absolute;
    top: -0.8vw;
    left: 3vw;
    width: 1.8vw;
    height: 1.5vw;
`

interface Feeling{

    level: number
    questLevel: number
}

const Feeling = ({level, questLevel}: Feeling) => {

    //regresa un numero entre 0 y 1 que representa un chance de lograr el quest
    const qs = useGetFeelings(level, questLevel)

    return (
        <>
            <ConditionalRender condition={qs >= 0.90}>
                <FeelingWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/over_confident.webp"  
                        alt="felling buble" 
                        width={1.8} 
                        height={1.5} 
                        layout="responsive" 
                    />
                </FeelingWrapper>
            </ConditionalRender>

            <ConditionalRender condition={qs >= 0.80 && qs < 0.90}>
                <FeelingWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/confident.webp"  
                        alt="felling buble" 
                        width={1.8} 
                        height={1.5} 
                        layout="responsive" 
                    />
                </FeelingWrapper>
            </ConditionalRender>

            <ConditionalRender condition={qs >= 0.70 && qs < 0.80}>
                <FeelingWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/insecure.webp"  
                        alt="felling buble" 
                        width={1.8} 
                        height={1.5}  
                        layout="responsive"
                    />
                </FeelingWrapper>
            </ConditionalRender>

            <ConditionalRender condition={qs >= 0.60 && qs < 0.70}>
                <FeelingWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/fearful.webp"  
                        alt="felling buble" 
                        width={1.8} 
                        height={1.5}  
                        layout="responsive"
                    />
                </FeelingWrapper>
            </ConditionalRender>

            <ConditionalRender condition={qs >= 0.50 && qs < 0.60}>
                <FeelingWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/panicking.webp"  
                        alt="felling buble" 
                        width={1.8} 
                        height={1.5}  
                        layout="responsive"
                    />
                </FeelingWrapper>
            </ConditionalRender>

            <ConditionalRender condition={qs < 0.50}>
                <FeelingWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/terrified.webp"  
                        alt="felling buble" 
                        width={1.8} 
                        height={1.5}  
                        layout="responsive"
                    />
                </FeelingWrapper>
            </ConditionalRender>
        </>
        )
}

export default Feeling