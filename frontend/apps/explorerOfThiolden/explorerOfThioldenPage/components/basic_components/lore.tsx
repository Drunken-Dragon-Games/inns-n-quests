import Image from "next/image"
import styled from "styled-components"
import { TextElMessiri } from "."
import Link from "next/link"


const LoreComponent = styled.div`
    position: relative;
    padding: 1vw 0vw 0vw 1.5vw;
    display: flex;

    @media only screen and (max-width: 414px) {
        width: 100%;
        padding: 0vw 15vw;
        display: block;
        height: 32vw;
    }
    
`
const StyledOrnament = styled.div`
    width: 0.365vw;
    height: 4.297vw;
    position: relative;
    margin-top: 0.2vw;
    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const ImageWrapper = styled.div`
    width: 0.365vw;
    height: 4.297vw;
    left: 0.3vw;
`

const OrnamentTextWrapper = styled.div`
    position: absolute;
    top: 1.65vw;
    right: -0.3vw;
`


const LoreContainer = styled.div`
    width:  13.958vw;
    height: 4.635vw;
    padding: 0vw 0vw 0vw 3.542vw;

    @media only screen and (max-width: 414px) {
        width: 100%;
        padding: 0vw 0vw 0vw 10vw;
        margin-top: 4vw;
    }
`


const DataCard = styled.div`
    display: flex;
`
const IconWrapper = styled.div`
    margin-top: 0vw; 
    margin-right: 0.25vw;
    width: 0.7vw;
    height: 0.7vw;

    @media only screen and (max-width: 414px) {
        width: 3.5vw;
        height: 3.5vw;
        margin-right: 4vw;
        
    }
`
const MarginBottom = styled.div`
    margin-bottom: 0.2vw;
    &:last-child{
        margin-bottom: 0vw;
    }

    @media only screen and (max-width: 414px) {
        margin-bottom: 1vw;

        &:last-child{
            margin-bottom: 0vw;
        }
        
    }
`
const DataCardReadme =styled.div`
    display: flex;
    cursor: pointer;
`

const StyledOrnamentMobil = styled.div`
    display: none;
    @media only screen and (max-width: 414px) {
        display: block;
        width: 0.365vw;
        height: 4.297vw;
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


interface Lore {
    years: string
    gameClass: string
    race: string
    name: string
}

const Lore = ({years, gameClass, race, name} : Lore) =>{

    const yearsText = `${years} yrs old`

    return (<>
        <LoreComponent>
            <StyledOrnament>
                <ImageWrapper>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/lore_ornament.png"
                        alt = "ornament drunken dragon"   
                        layout = "responsive" 
                        width={7} 
                        height={82.5}
                    />
                </ImageWrapper>
                <OrnamentTextWrapper>
                    <TextElMessiri color="#B39D7C" fontsize={0.565} fontsizeMobile={4} lineHeightMobil ={4.2}>Lore</TextElMessiri>
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
                    <TextElMessiri color="#B39D7C" fontsize={0.565} fontsizeMobile={4} lineHeightMobil ={4.2}>Lore</TextElMessiri>
                </OrnamentTextWrapperMobil>
            </StyledOrnamentMobil>

            <LoreContainer>
                <MarginBottom>
                    <DataCard>
                        <IconWrapper>
                            <Image 
                                src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/race_symbol.svg"
                                alt = "race drunken dragon"   
                                layout = "responsive" 
                                width={500} 
                                height={500}
                            />
                        </IconWrapper>
                        <TextElMessiri color="#C0BAB1" fontsize={0.8} fontsizeMobile={4.5} lineHeightMobil ={4.7}>{race}</TextElMessiri>
                    </DataCard>
                </MarginBottom>

                <MarginBottom>
                    <DataCard>
                        <IconWrapper>
                            <Image 
                                src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/year_symbol.svg"
                                alt = "year drunken dragon"   
                                layout = "responsive" 
                                width={5000} 
                                height={5000}
                            />
                        </IconWrapper>
                        <TextElMessiri color="#C0BAB1" fontsize={0.8} fontsizeMobile={4.5} lineHeightMobil ={4.7}>{yearsText}</TextElMessiri>
                    </DataCard>
                </MarginBottom>

                
                <MarginBottom>
                    <DataCard>
                        <IconWrapper>
                            <Image 
                                src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/class_symbol.svg"
                                alt = "class drunken dragon"   
                                layout = "responsive" 
                                width={5000} 
                                height={5000}
                            />
                        </IconWrapper>
                        <TextElMessiri color="#C0BAB1" fontsize={0.8} fontsizeMobile={4.5} lineHeightMobil ={4.7}>{gameClass}</TextElMessiri>
                    </DataCard>
                </MarginBottom>
                
                <Link href={`https://encyclopedia.drunkendragon.games/en/Characters/${name}`} passHref={true}>
                    <a target="_blank">
                        <MarginBottom>
                            <DataCardReadme>
                                <IconWrapper>
                                    <Image 
                                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/lore_symbol.svg"
                                        alt = "readme drunken dragon"   
                                        layout = "responsive" 
                                        width={5000} 
                                        height={5000}
                                    />
                                </IconWrapper>
                                <TextElMessiri color="#C58E31" fontsize={0.8} fontsizeMobile={4.5} lineHeightMobil ={4.7}>Read more..</TextElMessiri>
                            </DataCardReadme>
                        </MarginBottom>
                    </a>
                </Link>
            </LoreContainer>

        </LoreComponent>
    </>)
}

export default Lore