import Image from "next/image"
import styled from "styled-components"
import { TextElMessiri, ClassAndFactionRarity } from "."
import { useSelector } from "react-redux"
// import { selectGeneralStateReducer } from "../../features/generalState"
import { useGetRarity, useMaterial } from "../../hooks"
import { useGeneralSelector } from "../../../../../features/hooks" 
import { selectGeneralReducer } from "../../../../../features/generalReducer"

const StatsComponent = styled.div`
    position: relative;
    padding: 0.5vw 0vw 0vw 1.5vw;
    display: flex;

    @media only screen and (max-width: 414px) {
        width: 100%;
        padding: 0vw 15vw;
        display: block;
    }
    
`
const StyledOrnament = styled.div`
    width: 0.365vw;
    height: 8.297vw;
    position: relative;
    margin-top: 0.4vw;
    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const ImageWrapper = styled.div`
    width: 0.365vw;
    height: 8.297vw;
    left: 0.3vw;
`

const OrnamentTextWrapper = styled.div`
    position: absolute;
    top: 4.2vw;
    right: -0.5vw;
`

const StyledOrnamentMobil = styled.div`
    display: none;
    @media only screen and (max-width: 414px) {
        display: block;
        width: 0.365vw;
        height: 4.297vw;
        margin-bottom: 3vw;
    }
`

const ImageWrapperMobil = styled.div`
    width: 60vw;
    height: 3vw;
    margin-left: 5vw;
`

const OrnamentTextWrapperMobil = styled.div`
    position: absolute;
    top: -2.2vw;
    left: 46vw;
`

const MiniatureAndStatsWrapper = styled.div`
    display: flex;
    @media only screen and (max-width: 414px) {
        display: flex;
    }
`

const MiniatureImgWrapper = styled.div`
    display: flex;
    height: 12vw;
    position: relative;
    @media only screen and (max-width: 414px) {
        display: flex;
    }
`

const MiniatureImg = styled.div`
    width: 12vw;
    height: 12vw;
    position: absolute;
    top: -1.2vw;

    img{        
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }

    @media only screen and (max-width: 414px) {
        width: 50vw;
        height: 50vw;
        top: -5vw;
        left: 4.5vw;
    }
`

const MarginBottom = styled.div`
    margin-bottom: 0.7vw;

    @media only screen and (max-width: 414px) {
        margin-bottom: 3vw;
    }
`


const StatsNumberComponent = styled.div`
    position: relative;
    padding: 0vw 0vw 0vw 2.8vw;
    display: flex;  

    
    @media only screen and (max-width: 414px) {
        padding: 0vw 22vw;
        margin-top: 3vw;
    }
`

const StatNumber = styled.div`
    border: 0.13vw solid #FFFFFF;
    border-top: none;
    border-radius:  0vw 0vw 1.5vw 1.5vw;
    width: 3vw;
    height: 2.604vw;
    margin-right: 0.521vw;
    position: relative;

    @media only screen and (max-width: 414px) {
        border: 0.5vw solid #FFFFFF;
        border-top: none;
        width: 14vw;
        height: 13vw;
        border-radius:  0vw 0vw 6.5vw 6.5vw;
    }
`

const ApsStatNumber = styled.div`
    position: absolute;
    border: 0.13vw solid #E7BE6D;
    border-bottom: none;
    border-radius:  1.5vw 1.5vw 0vw 0vw ;
    width: 3vw;
    height: 3.104vw;
    margin-right: 0.521vw;
    top: -0.5vw;
    right: 1.3vw;

    @media only screen and (max-width: 414px) {
        border: 0.5vw solid #E7BE6D;
        border-bottom: none;
        width: 14vw;
        height: 13vw;
        border-radius: 6.5vw 6.5vw 0vw 0vw;
        top: -0.5vw;
        right: 19vw;
    }
`

interface AppStatText{
    left: number
    leftMobil: number
}
const AppStatText = styled.div<AppStatText>`
    position: absolute;
    top: -1vw;
    left: ${props => props.left}vw;

    @media only screen and (max-width: 414px) {
        top: -4vw;
        left: ${props => props.leftMobil}vw;
    }
`


const IconStat = styled.div`
    width: 1.8vw;
    height: 1vw;
    position: absolute;
    left: 0.6vw;
    top:-0.2vw;

    @media only screen and (max-width: 414px) {
        width: 8.3vw;
        height: 7.5vw;
        left: 2.8vw;
        top:0.5vw;
    }
`


const Center = styled.div`
    position: flex;
    width: 100%;
    position: absolute;    
    bottom: 0.1vw;
`
const AppStatNumber = styled.div`
    margin: auto;
`

const ApsData = styled.div`
    margin-top: 0.2vw;
    @media only screen and (max-width: 414px) {
        margin-top: 1.5vw;
    }
`
const ApsPercentage = styled.div`
    margin-top: -0.3vw;
    @media only screen and (max-width: 414px) {
        margin-top: 0vw;
    }
`

const OrnamentWrapper =styled.div`
    width: 11.719vw;
    height: 2.013vw;
    margin: auto;

    @media only screen and (max-width: 414px) {
        width: 60vw;
        height: 3vw;
    }
`

const CenterOrnament = styled.div`
    display: flex;
    width: 100%;
    margin-top: 0.781vw;

    @media only screen and (max-width: 414px) {
        margin-top: 5vw;
    }
`

const ClassAndFactionRarityPosition = styled.div`
    margin-left: 10vw;

    @media only screen and (max-width: 414px) {
        margin-left: 52vw;
    }
`

interface factionRarity{
    advofeast: quantity
    auristar: quantity
    deadqueen: quantity
    drunkendragon: quantity
    jagermyr: quantity
    kullmyr: quantity
    nurmyr: quantity
    vilnay: quantity
}

interface quantity{
    percentage: number
    total: number
}

interface AdventurerStats{
    src_miniature: string
    Faction: string
    Game_Class: string
    Athleticism: number
    Intellect: number
    Charisma: number
}

interface materialRarety {
    bronze: quantity
    diamond: quantity
    drunkendragon: quantity
    gold: quantity
    myrthrill: quantity
    silver: quantity
}

interface factionsObject{

    Auristar: string
    "The Dead Queen": string
    "Adventurer of the Drunken Dragon": string
    "Adventurer of the East": string
    Jagermyr: string
    Kullmyr: string
    Nurmyr: string
    Vilnay: string
}
const factionsObject: factionsObject ={
    Auristar: "auristar",
    "The Dead Queen": "deadqueen",
    "Adventurer of the Drunken Dragon": "drunkendragon",
    "Adventurer of the East": "advofeast",
    Jagermyr: "jagermyr",
    Kullmyr: "kullmyr",
    Nurmyr: "nurmyr",
    Vilnay: "vilnay"

}


interface classObject {
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

const classObject: classObject = {
    Alchemist: "alchemist",
    Bard: "bard",
    Blacksmith: "blacksmith",
    Brewer: "brewer",
    Carpenter: "carpenter",
    Cleric: "cleric" ,
    Cook: "cook",
    Druid: "druid",
    Fighter: "fighter",
    Host: "host",
    Knight:"knight",
    Mage: "mage",
    Paladin: "paladin",
    Ranger: "ranger",
    Rogue: "rogue",
    Trader: "trader",
    Warlock: "warlock"

}

interface classRarity {
    alchemist: quantity 
    bard: quantity
    blacksmith: quantity
    brewer: quantity
    carpenter:quantity
    cleric:quantity 
    cook:quantity
    druid: quantity
    fighter: quantity
    host: quantity
    knight:quantity
    mage: quantity
    paladin: quantity
    ranger: quantity
    rogue: quantity
    trader: quantity
    warlock: quantity
}

const AdventurerStats = ({src_miniature, Faction,  Game_Class, Athleticism, Intellect, Charisma}:AdventurerStats) =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const rarities = useGetRarity(generalSelector.exploreOfThioldenReducer.data.data)
    
    const factionIndex = factionsObject[(Faction as keyof factionsObject)]

    const classIndex =  classObject[(Game_Class as keyof classObject)]
    
    const APS = Athleticism + Intellect + Charisma

    const material  =useMaterial(APS)

    let name = src_miniature.split("_")[0]
    const isChroma =  src_miniature.split("_")[2]
    

    if(name== "avva"){
       const random =  Math.floor(Math.random() * 10);
            if(random <= 4){
                name = "avva_ice"
            } else{
                name = "avva_fire"
            }
       
    }
    const urlMiniatures = `https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/miniatures/${name}-front-${isChroma == "1" ? "chroma" : "plain"}.png`
    
    
    return (<>
        <StatsComponent>
            <StyledOrnament>
                <ImageWrapper>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/lore_ornament.png"
                        alt = "ornament drunken dragon"   
                        layout = "responsive" 
                        width={7} 
                        height={180}
                    />
                </ImageWrapper>
                <OrnamentTextWrapper>
                    <TextElMessiri color="#B39D7C" fontsize={0.565}>Rarity</TextElMessiri>
                </OrnamentTextWrapper>
            </StyledOrnament>

            <StyledOrnamentMobil>
                <ImageWrapperMobil>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/lore_ornament_mobile.png"
                        alt = "ornament drunken dragon"   
                        layout = "responsive" 
                        width={82.5} 
                        height={4}
                    />
                </ImageWrapperMobil>
                <OrnamentTextWrapperMobil>
                    <TextElMessiri color="#B39D7C" fontsize={0.565} fontsizeMobile={4} lineHeightMobil ={4.2}>Rarity</TextElMessiri>
                </OrnamentTextWrapperMobil>
            </StyledOrnamentMobil>


            <MiniatureAndStatsWrapper>

                <MiniatureImgWrapper>
                    <MiniatureImg>  
                        <Image 
                            src = {urlMiniatures}
                            alt = "miniature drunken dragon"   
                            layout = "responsive" 
                            width={200} 
                            height={200}
                            priority
                        />
                    </MiniatureImg>
                </MiniatureImgWrapper>


                <ClassAndFactionRarityPosition>
                    <MarginBottom>
                        <ClassAndFactionRarity 
                            title="in Game Class" 
                            name={Game_Class}
                            rarity= {rarities !== null ? rarities.classRarity[(classIndex as keyof classRarity)].percentage.toString() : "0"}
                            type="in_game"
                        />
                    </MarginBottom>
                    
                    <ClassAndFactionRarity 
                        title ="Faction" 
                        name={Faction}
                        rarity= {rarities !== null ? rarities.factionRarity[(factionIndex as keyof factionRarity)].percentage.toString() : "0"}
                        type="faction"
                    />
                </ClassAndFactionRarityPosition>

            </MiniatureAndStatsWrapper>
         </StatsComponent>
         <StatsNumberComponent>

            <StatNumber>
                <AppStatText left={0} leftMobil={0.5}>
                    <TextElMessiri color="#C0BAB1" fontsize={0.65} textAlign="center"  fontsizeMobile={3} lineHeightMobil ={3.2}>Charisma</TextElMessiri>
                </AppStatText>
                <IconStat>
                    <Image 
                            src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/charisma.svg"
                            alt = "ornament drunken dragon"   
                            layout = "responsive" 
                            width={35} 
                            height={30}
                           
                    />
                </IconStat>

                <Center>
                    <AppStatNumber>
                        <TextElMessiri color="#B39D7C" fontsize={0.8} textAlign="center" fontsizeMobile={3.5} lineHeightMobil ={3.7}>{Charisma.toString()}</TextElMessiri>
                    </AppStatNumber>
                </Center>
            </StatNumber>

            <StatNumber>
                <AppStatText left={-0.15} leftMobil={0}>
                    <TextElMessiri color="#C0BAB1" fontsize={0.65} textAlign="center"  fontsizeMobile={3} lineHeightMobil ={3.2}>Athleticism</TextElMessiri>
                </AppStatText>

                <IconStat>
                    <Image 
                            src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/athleticism.svg"
                            alt = "ornament drunken dragon"   
                            layout = "responsive" 
                            width = {35} 
                            height = {30}
                    />
                </IconStat>

                <Center>
                    <AppStatNumber>
                        <TextElMessiri color="#B39D7C" fontsize={0.8} textAlign="center"  fontsizeMobile={3.5} lineHeightMobil ={3.7}>{Athleticism.toString()}</TextElMessiri>
                    </AppStatNumber>
                </Center>

            </StatNumber>

            <StatNumber>
                <AppStatText left={0.3} leftMobil={1.5}>
                    <TextElMessiri color="#C0BAB1" fontsize={0.65} textAlign="center"  fontsizeMobile={3} lineHeightMobil ={3.2}>Intellect</TextElMessiri>
                </AppStatText>

                <IconStat>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/intellect.svg"
                        alt = "ornament drunken dragon"   
                        layout = "responsive" 
                        width={35} 
                        height={30}
                    />
                </IconStat>
                <Center>
                    <AppStatNumber>
                        <TextElMessiri color="#B39D7C" fontsize={0.8} textAlign="center"  fontsizeMobile={3.5} lineHeightMobil ={3.7}>{Intellect.toString()}</TextElMessiri>
                    </AppStatNumber>
                </Center>

            </StatNumber>

            <ApsStatNumber>
                <ApsData>
                    <TextElMessiri color="#B39D7C" fontsize={0.9} textAlign="center"  fontsizeMobile={4.5} lineHeightMobil ={4.7}>APS</TextElMessiri> 
                    <TextElMessiri color="#B39D7C" fontsize={1.3} textAlign="center"  fontsizeMobile={4} lineHeightMobil ={4.2}>{(Athleticism + Intellect + Charisma).toString()}</TextElMessiri>
                    <ApsPercentage>
                        <TextElMessiri color="#B39D7C" fontsize={0.6} textAlign="center" fontsizeMobile={2.5} lineHeightMobil ={2.7}>{rarities !== null ? rarities.materialRarety[material as keyof materialRarety].percentage.toString() : "0"}%</TextElMessiri>
                    </ApsPercentage> 
                </ApsData>
            </ApsStatNumber>
         </StatsNumberComponent>

        <CenterOrnament>
            <OrnamentWrapper>
                <Image 
                    src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/stats_end_ornament.svg"
                    alt = "ornament"   
                    layout = "responsive" 
                    width={225} 
                    height={39}
                />
            </OrnamentWrapper>
        </CenterOrnament>
    </>)
}

export default AdventurerStats