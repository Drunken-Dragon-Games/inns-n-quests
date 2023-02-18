import styled from "styled-components"
import Image from "next/image"
import { SealType } from "../../../dsl"

const SealWrapperKingsPlea = styled.div`
    position: absolute;
    bottom: 0vw;
    right: 1vw;
    width: 4vw;
    height: 4vw;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

const SealWrapperHeroicQuest = styled.div`
    position: absolute;
    bottom: 0vw;
    right: 1.5vw;
    width: 2.5vw;
    height: 4vw;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

const SealWrapperValiantAdventure = styled.div`
    position: absolute;
    bottom: 1.5vw;
    right: 1.5vw;
    width: 2.2vw;
    height: 2.2vw;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

const SealWrapperTownsfolk = styled.div`
    position: absolute;
    bottom: 1.5vw;
    right: 1.5vw;
    width: 4vw;
    height: 1.5vw;

    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

export default ({ rarity }: { rarity: SealType }) => {
    if (rarity == "kings-plea")
        return (
            <SealWrapperKingsPlea>
                <Image
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea.png"
                    alt="paper prop"
                    width={50}
                    height={50}
                    layout="responsive"
                />
            </SealWrapperKingsPlea>
        )
    else if (rarity == "heroic-quest")
        return (
            <SealWrapperHeroicQuest>
                <Image
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest.png"
                    alt="paper prop"
                    width={50}
                    height={80}
                    layout="responsive" />
            </SealWrapperHeroicQuest>
        )
    else if (rarity == "valiant-adventure")
        return (
            <SealWrapperValiantAdventure>
                <Image
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/valiant_adventure.png"
                    alt="paper prop"
                    width={50}
                    height={50}
                    layout="responsive" />
            </SealWrapperValiantAdventure>
        )
    else 
        return (
            <SealWrapperTownsfolk>
                <Image 
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/townsfolk.png"
                    alt="paper prop" 
                    width={10} 
                    height={4} 
                    layout="responsive" />
            </SealWrapperTownsfolk>
        )
}
