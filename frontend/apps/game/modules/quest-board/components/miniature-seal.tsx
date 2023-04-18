import Image from "next/image"
import styled from "styled-components"
import { PixelArtImage, SealType, vh } from "../../../../common"

const SealWrapperKingsPlea = styled.div`
    position: absolute;
    bottom: -0.5vh;
    right: 1.5vh;
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
                <PixelArtImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea.png"
                    alt="paper prop"
                    width={8}
                    height={8}
                    units={vh(1)}
                />
            </SealWrapperKingsPlea>
        )
    else if (rarity == "heroic-quest")
        return (
            <SealWrapperHeroicQuest>
                <PixelArtImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest.png"
                    alt="paper prop"
                    width={5}
                    height={8}
                    units={vh(1)}
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
