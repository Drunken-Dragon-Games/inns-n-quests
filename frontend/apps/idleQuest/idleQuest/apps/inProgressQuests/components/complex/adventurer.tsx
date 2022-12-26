import styled, {keyframes, css} from "styled-components"
import { Feelings, Emoji } from "../../../../utils/components/basic_component"
import { useGetLevel } from "../../../../utils/hooks";
import { useGetRewardExp, useGetLevelUp, useIsDead } from "../../hooks";
import { useState, useEffect } from "react"
import Image from "next/image";

const outOpacityDeadMark = keyframes`
    0% {opacity: 0}
    50% {opacity: 0}
    80% {opacity: 0.2}
    100% {opacity: 1}
`

const Card = styled.div`
    width: 7vw;
    height: 8vw;
    position: relative;
`

const Flex = styled.div`
    display: flex;
    position: absolute
`

const Center = styled.div`
    display: flex;
    height: 7.8vw;
`

const AdventurerWrapper = styled.div`
    margin: auto;   
    width: 6vw;
    height: 7.8vw;  
`

const ExperienceBar = styled.div`
    width: 3vw;
    height: 0.4vw;
    border: 1px solid #7A7976;
    border-radius: 0vw 1vw 0vw 1vw;
    overflow: hidden;
    margin: 0.5vw 0vw 0vw 0.8vw;
`

interface IProps_Experience{
    experience : number 
}

const Experience = styled.div<IProps_Experience>`
    height: 0.3vw;
    background-color:#793312;
    width: ${props => props.experience}%;

`

const Level = styled.div`
    font-size: 0.5vw;
    color: white;
    font-weight: 800;
    font-family: arial;
    margin-top: 0.5vw;
    text-align: center;
`

interface DeadMarkWrapper {
    isDisplay: boolean
}


const DeadMarkWrapper = styled.div <DeadMarkWrapper>`
    position: absolute;
    top: 1vw;
    left: 0.5vw;
    z-index: 2;
    animation: ${outOpacityDeadMark} 1.2s;
    ${props => props.isDisplay == true  ?   "" : "display: none"};
    img{
        width: 5vw !important;
        height: 4vw !important;
    }

`

const AdventurerImageWrapper = styled.div`
    display: flex;
    width: 6vw;
    height: 7.8vw;  

    div{
        margin: auto auto 0vw auto;
    }
`

interface FeelingWrapper{
    isAnimationFailing: boolean
    isAnimationSucceeded: boolean
}

const outOpacityShadowFeelingFailing = keyframes`
    0% {opacity: 1}
    45% {opacity: 0}
    100% {opacity: 0}
`

const outOpacityShadowFeelingSucceeded = keyframes`
    0% {opacity: 1}
    10% {opacity: 0}
    100% {opacity: 0}
`
const animationFeelingWrapperFailed = (props: any) =>
  css`
    ${outOpacityShadowFeelingFailing} forwards 3s;
  `

  const animationFeelingWrapperSucceeded = (props: any) =>
  css`
    ${outOpacityShadowFeelingSucceeded} forwards 4s;
  `

const FeelingWrapper= styled.div<FeelingWrapper>`
    position: absolute;
    left: -0.5vw;
    top: -0.2vw;
    animation: ${props => props.isAnimationFailing ? animationFeelingWrapperFailed : ""}  ${props => props.isAnimationSucceeded ? animationFeelingWrapperSucceeded : ""};
`

interface ExperienceWrapper{
    isAnimationSucceeded: boolean
}

const experienceAnimation = keyframes`
    10% {opacity: 0 }
    20% {opacity: 1 }
    70% {opacity: 1 }
    80% {opacity: 0 }
    100% {opacity: 0}
`

const ExperienceWrapper = styled.div<ExperienceWrapper>`
    position: absolute;
    top: -1.5vw;
    left: 0.7vw;
    z-index: 4;
    opacity: 0;
    animation: ${props => props.isAnimationSucceeded  ? experienceAnimation : ""} forwards 4s;
`


interface EmojiWrapper{
    isAnimationFailing: boolean
    isAnimationSucceeded: boolean
}

const EmojiAnimationFailing = keyframes`
    50% {opacity: 0}
    80% {opacity: 1}
    100% {opacity: 1}
`

const EmojiAnimationSucceeded = keyframes`
    0% {opacity: 0}
    80% {opacity: 0}
    90% {opacity: 1}
    100% {opacity: 1}
`
const animationEmojiWrapperFailed = (props: any) =>
  css`
    ${EmojiAnimationFailing} forwards 3s;
  `

  const animationEmojiWrapperSucceeded = (props: any) =>
  css`
    ${EmojiAnimationSucceeded} forwards 4s;
  `


const EmojiWrapper = styled.div<EmojiWrapper>`
   position: absolute;
   left: 2.1vw;
   top: -1vw;
   opacity: 0;
   animation: ${props => props.isAnimationFailing ? animationEmojiWrapperFailed : ""} ${props => props.isAnimationSucceeded ? animationEmojiWrapperSucceeded : ""};
`






interface enrolls{
    adventurer: adventurer
    adventurer_id: string
    taken_quest_id: string
}

interface adventurer{
    experience: number
    id: string
    in_quest: boolean
    metadata: metadata
    on_chain_ref: string
    player_stake_address: string
    type: "pixeltile" | "gma"
}

interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
}

interface interfaceEnrolled {
    data: enrolls
    questLevel: number
    claimed: claimed
    isDead: string [] | null
    rewardExp: exp_given [] | null
    children: JSX.Element
}

interface claimed {
    isClaimed: boolean
    exp_given: exp_given [] | null
    state: "failed" | "succeeded" | null
    dead_adventurers: any
}

interface exp_given {
    experience: number
    id: string
}

const Adventurer = ({data, questLevel, claimed , isDead, rewardExp, children} : interfaceEnrolled ) =>{
    
    const newExperience  = useGetRewardExp(data.adventurer_id, rewardExp, 500 )
    const [ level ] = useGetLevel(data.adventurer.experience)
    const [ newLevel, levelBar] = useGetLevelUp(data.adventurer.experience, level , newExperience, 4000)
    const  isAdventureDead  = useIsDead(data.adventurer_id, isDead)
    

    const [ isAdventurerDeadAnimation, setIsAdventurerDeadAnimation ] =useState<boolean>(false)
    const [ isAnimationFailed, setIsAnimationFailed ] = useState<boolean>(false)
    const [ isAnimationSucceeded, setIsAnimationSucceeded ] = useState<boolean>(false)

    //este efecto se activa cuando y activa una animacion dependiendo si es fallida o exitosa
    useEffect(() => {

        if(claimed.isClaimed == true){
            if(claimed.state == "failed"){
                setIsAnimationFailed(true)
            } else if (claimed.state == "succeeded"){
                setIsAnimationSucceeded(true)
            }   
        }

    }, [claimed])

    //se activa cuando cambia isAdventuerDead es un booleando y activa una nimacion despues de tiempo
    useEffect(() => {

        if(isAdventureDead == true){
            const isAnimationDead = setTimeout(function(){
                setIsAdventurerDeadAnimation(true)
            }, 450);
        }

    }, [isAdventureDead])
    
        
    return (<>

        <Card>
            <Flex>
                <Center>
                    <AdventurerWrapper>

                        <FeelingWrapper isAnimationFailing={isAnimationFailed} isAnimationSucceeded={isAnimationSucceeded}>
                            <Feelings level = {level} questLevel ={questLevel}/>
                        </FeelingWrapper>

                        <ExperienceWrapper isAnimationSucceeded={isAnimationSucceeded}>
                            <Level>LEVEL {isAdventurerDeadAnimation == true ?  "1" : newLevel}</Level>

                            <ExperienceBar>
                                <Experience experience = {isAdventurerDeadAnimation == true ? 0 : levelBar}/>
                            </ExperienceBar>

                        </ExperienceWrapper>
                        
                        <EmojiWrapper isAnimationFailing={isAnimationFailed} isAnimationSucceeded={isAnimationSucceeded}>
                            <Emoji  questStatus = {claimed.state} isAdventureDead={isAdventureDead} type={data.adventurer.type}/>
                        </EmojiWrapper>
                

                        <DeadMarkWrapper isDisplay ={isAdventureDead}>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/chest_mark_fail.png"  alt="fail mark image" width={2000} height={1250} />
                        </DeadMarkWrapper>

                        <AdventurerImageWrapper>
                            <div>
                                {children}
                            </div>
                        </AdventurerImageWrapper>
                        
                    </AdventurerWrapper>
                </Center>
            </Flex>
        </Card>

    </>)
}

export default Adventurer