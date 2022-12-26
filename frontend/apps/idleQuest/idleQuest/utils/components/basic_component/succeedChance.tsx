import styled from "styled-components"
import Image from "next/image"
import { useGetSucceedChance, useGetAverageLevel } from "../../../apps/availableQuest/hooks"

const SucceedChanceWrapper = styled.div`
    width: 9vw;
    margin-left: auto;
    margin-right: 2.5vw;
`

const Test = styled.p`
    font-family: VT323;
    font-size: 1.2vw;
    color: #793312;
    line-height: 1.5vw;
    font-weight: 100;
    text-align: center;
    text-transform: uppercase;
`

const PercentageElement = styled.div`
    display: flex;
    justify-content: center;
`

const CloverImages = styled.div`
    width: 3.6vw;
    height: 2vw;
    margin-left: -0.5vw;
`

const PercentageTest = styled.div`
    p{
        font-family: VT323;
        font-size: 3.5vw;
        color: #793312;
        line-height: 2vw;
        font-weight: 100;
        text-transform: uppercase;
    }
`


interface succeedChance{
    questDifficulty: number
    questSlots: number
    requirementBonus: number
    adventurersList: (string | undefined) [] | enrolls []
    type: "available" | "inProgress"
}


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

const SucceedChance = ({questDifficulty, questSlots, requirementBonus, adventurersList, type} : succeedChance) =>{

    const [ averageLevel] =useGetAverageLevel(questSlots, adventurersList, type)
    
    
    const [percentage] = useGetSucceedChance(questDifficulty, questSlots, averageLevel, requirementBonus)
    
    return (<>
                <SucceedChanceWrapper>
                    <Test>Success chance</Test>
                    <PercentageElement>
                        <CloverImages>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/clover.svg"  alt="clover drunken Dragon" width={2000} height={1250} />
                        </CloverImages>
                        <PercentageTest>
                            <p>{percentage}%</p> 
                        </PercentageTest>
                    </PercentageElement>
                </SucceedChanceWrapper>
    </>)
}

export default SucceedChance