import styled from "styled-components"
import Image from 'next/image'
import { ConditionalRender } from "../../../../../utils/components/basic_components"

const SealWrapperHeroicQuest = styled.div`

    margin: 4vw 2vw 0vw auto;

    img{
        width: 6vw !important;
        height: 9vw !important;
    }
`

const SealWrapperKingsPlea = styled.div`

    margin: 4vw 1vw 0vw auto;
    // padding: 5vw 0vw;

    img{
        width: 9vw !important;
        height: 9.5vw !important;
    }
`

const SealWrapperValiantAdventure = styled.div`

    margin: 4vw 1.5vw 0vw auto;

    img{
        width: 6vw !important;
        height: 6vw !important;
    }
`

const SealWrapperTownsfolk = styled.div`

    margin: 5.9vw 2.5vw 0vw auto;

    img{
        width: 8vw !important;
        height: 3vw !important;
    }
`


interface seals {
    seal: string
}

const Seals =({seal}: seals) => {      
    return(
        <>
            <ConditionalRender condition = {seal == "heroic_quest"}>
                <SealWrapperHeroicQuest>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest_big.png"  alt="paper prop" width={2000} height={1250} />
                </SealWrapperHeroicQuest>
            </ConditionalRender>
    
            <ConditionalRender condition = {seal == "kings_plea"}>
                <SealWrapperKingsPlea>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea_big.png"  alt="paper prop" width={2000} height={1250} />
                </SealWrapperKingsPlea>
            </ConditionalRender>

            <ConditionalRender condition = {seal == "valiant_adventure"}>
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