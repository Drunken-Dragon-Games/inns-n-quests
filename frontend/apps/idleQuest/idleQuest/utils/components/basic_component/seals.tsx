import styled from "styled-components"
import Image from 'next/image'
import { ConditionalRender } from "../../../../../utils/components/basic_components"
import { SealType } from "../../../../dsl"

const SealWrapperHeroicQuest = styled.div`

    margin: 4vmax 2vmax 0vmax auto;

    img{
        width: 6vmax !important;
        height: 9vmax !important;
    }
`

const SealWrapperKingsPlea = styled.div`

    margin: 4vmax 1vmax 0vmax auto;
    // padding: 5vmax 0vmax;

    img{
        width: 9vmax !important;
        height: 9.5vmax !important;
    }
`

const SealWrapperValiantAdventure = styled.div`

    margin: 4vmax 1.5vmax 0vmax auto;

    img{
        width: 6vmax !important;
        height: 6vmax !important;
    }
`

const SealWrapperTownsfolk = styled.div`

    margin: 5.9vmax 2.5vmax 0vmax auto;

    img{
        width: 8vmax !important;
        height: 3vmax !important;
    }
`

const Seals =({seal}: { seal: SealType }) => {      
    return(
        <>
            <ConditionalRender condition = {seal == "heroic-quest"}>
                <SealWrapperHeroicQuest>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest_big.png"  alt="paper prop" width={2000} height={1250} />
                </SealWrapperHeroicQuest>
            </ConditionalRender>
    
            <ConditionalRender condition = {seal == "kings-plea"}>
                <SealWrapperKingsPlea>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea_big.png"  alt="paper prop" width={2000} height={1250} />
                </SealWrapperKingsPlea>
            </ConditionalRender>

            <ConditionalRender condition = {seal == "valiant-adventure"}>
                <SealWrapperValiantAdventure>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/valiant_adventure_big.png"  alt="paper prop" width={2000} height={1250} />
                </SealWrapperValiantAdventure>
            </ConditionalRender>

            <ConditionalRender condition = {seal == "townsfolk"}>
                <SealWrapperTownsfolk>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/townsfolk_big.png"  alt="paper prop" width={2000} height={1250} />
                </SealWrapperTownsfolk>
            </ConditionalRender>
        </>
    )

}

export default Seals