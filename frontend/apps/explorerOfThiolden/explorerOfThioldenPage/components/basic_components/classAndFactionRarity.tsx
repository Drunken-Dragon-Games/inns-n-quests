import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri } from "."

const ClassAndFactionRarityComponent = styled.div`
    width: 6.250vw;
    @media only screen and (max-width: 414px) {
        width: 15vw;
    }
`
const Title = styled.div`
    width: 4vw;
    margin: auto;
    @media only screen and (max-width: 414px) {
        width: 15vw;
    }
`
const Center = styled.div`
    display: flex;
`

const IconWrapper =styled.div`
    width: 2.2vw;
    height: 2.2vw;
    margin: auto;
    margin-top: 0.1vw;

    @media only screen and (max-width: 414px) {
        width: 9vw;
        height: 9vw;
        margin-top: 1vw;
    }
`

const TextWrapper = styled.div`

`


interface inClassGame {
    Alchemist: string 
    Bard: string
    Blacksmith: string
    Brewer: string
    Carpenter:string
    Cleric:string 
    Cook:string
    Druid: string
    Fighter: string
    Host: string
    Knight:string
    Mage: string
    Paladin: string
    Ranger: string
    Rogue: string
    Trader: string
    Warlock: string
}

const inClassGame:inClassGame  ={
        Alchemist: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/alchemist.svg", 
        Bard: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/bard.svg",
        Blacksmith:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/blacksmith.svg",
        Brewer:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/brewer.svg", 
        Carpenter:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/carpenter.svg", 
        Cleric:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/cleric.svg", 
        Cook:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/cook.svg", 
        Druid: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/druid.svg", 
        Fighter: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/fighter.svg", 
        Host: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/host.svg",
        Knight:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/knight.svg",
        Mage: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/mage.svg",
        Paladin: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/paladin.svg",
        Ranger: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/ranger.svg",
        Rogue: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/rogue.svg",
        Trader: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/trader.svg",
        Warlock: "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/class/warlock.svg",
    }


interface faction{
   "Adventurer of the East": string
   Auristar: string
   "Adventurer of the Drunken Dragon": string
   Jagermyr: string
   Kullmyr: string
   Nurmyr: string
   "The Dead Queen": string
   Vilnay: string
}

const faction: faction = {
   "Adventurer of the East":"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/adv_of_the_east.svg",
   Auristar:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/auristar.svg",
   "Adventurer of the Drunken Dragon":"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/drunken_dragon.svg",
   Jagermyr:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/jagermyr.svg",
   Kullmyr:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/kullmyr.svg",
   Nurmyr:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/nurmyr.svg",
   "The Dead Queen":"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/the_dead_queen.svg",
   Vilnay:"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/faction/vilnay.svg"
} 


interface ClassAndFactionRarity{
    title: string
    name: string
    rarity: string
    type: "in_game" | "faction"
}


const ClassAndFactionRarity = ({title, name, rarity, type}:ClassAndFactionRarity ) => {

    const nameAndRarity = `${name} ${rarity}%`
    
    return (<>
        <ClassAndFactionRarityComponent>
            <Center>
                <Title><TextElMessiri color = "#FFFFFF" fontsize={0.7} textAlign ="center"  fontsizeMobile={3} lineHeightMobil ={3.2}>{title}</TextElMessiri></Title>
            </Center>
            <Center>
                <IconWrapper>
                    <Image 
                        src = {type == "in_game" ? inClassGame[name as keyof typeof inClassGame] : faction[name as keyof typeof faction]}
                        alt = "ornament drunken dragon"   
                        layout = "responsive" 
                        width={40} 
                        height={40}
                        priority
                    />
                </IconWrapper>
            </Center>
            <TextWrapper>
                <TextElMessiri color = "#E7BE6D" fontsize={0.7} textAlign ="center" fontsizeMobile={3} lineHeightMobil ={3.2}>{nameAndRarity}</TextElMessiri>
            </TextWrapper>
        </ClassAndFactionRarityComponent>
    </>)
}

export default ClassAndFactionRarity