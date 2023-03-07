import styled from "styled-components"
import Image from "next/image"
import { SealType } from "../../../common"
import { PixelArtImage, vh } from "../../../utils"

const SealWrapperKingsPlea = styled.div`
    position: absolute;
    bottom: 0vh;
    right: 1vh;
    width: 4vh;
    height: 4vh;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

const SealWrapperHeroicQuest = styled.div`
    position: absolute;
    bottom: 0vh;
    right: 5vh;
    width: 2.5vh;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

const SealWrapperValiantAdventure = styled.div`
    position: absolute;
    bottom: 1.5vh;
    right: 1.5vh;
    width: 2.2vh;
    height: 2.2vh;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

const SealWrapperTownsfolk = styled.div`
    position: absolute;
    bottom: 1.5vh;
    right: 1.5vh;
    width: 4vh;
    height: 1.5vh;

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
                <PixelArtImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest.png"
                    alt="paper prop"
                    width={50}
                    height={80}
                    units={vh(0.1)}
                />
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
