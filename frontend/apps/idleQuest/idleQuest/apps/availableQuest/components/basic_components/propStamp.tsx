import styled from "styled-components"
import Image from "next/image"
import { ConditionalRender } from "../../../../../../utils/components/basic_components"

const SealWrapperKingsPlea = styled.div`
    position: absolute;
    bottom: 0vw;
    right: 1vw;
    width: 4vw;
    height: 4vw;
`

const SealWrapperHeroicQuest = styled.div`
    position: absolute;
    bottom: 0vw;
    right: 1.5vw;
    width: 2.5vw;
    height: 4vw;
`

const SealWrapperValiantAdventure = styled.div`
    position: absolute;
    bottom: 1.5vw;
    right: 1.5vw;
    width: 2.2vw;
    height: 2.2vw;
`

const SealWrapperTownsfolk = styled.div`
    position: absolute;
    bottom: 1.5vw;
    right: 1.5vw;
    width: 4vw;
    height: 1.5vw;

`

interface PropStamp{
    rarity: string
}

const PropStamp =({rarity}: PropStamp): JSX.Element =>{
    return(<>

            <ConditionalRender condition ={rarity == "kings_plea"} >
                <SealWrapperKingsPlea>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea.png"  alt="paper prop" width={50} height={50} layout="responsive" />
                </SealWrapperKingsPlea>
            </ConditionalRender>
              
            <ConditionalRender condition ={rarity == "heroic_quest"}>
                <SealWrapperHeroicQuest>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest.png"  alt="paper prop" width={50} height={80} layout="responsive" />
                </SealWrapperHeroicQuest>
            </ConditionalRender>  
                       

            <ConditionalRender condition ={rarity == "valiant_adventure"}>
                <SealWrapperValiantAdventure>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/valiant_adventure.png"  alt="paper prop" width={50} height={50} layout="responsive"/>
                </SealWrapperValiantAdventure>
            </ConditionalRender>

            <ConditionalRender condition ={rarity == "townsfolk"}>
                <SealWrapperTownsfolk>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/townsfolk.png"  alt="paper prop" width={10} height={4} layout="responsive" />
                </SealWrapperTownsfolk>
            </ConditionalRender>
        
    </>)
}

export default PropStamp