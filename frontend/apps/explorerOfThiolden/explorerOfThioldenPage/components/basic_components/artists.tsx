import styled from "styled-components"
import { TextElMessiri, Artist } from "."


const ArtistElement = styled.div`
    display: flex;
    padding: 0.5vw 0vw 0vw 0vw;
    margin-bottom: 0.781vw;
    &:last-child{
        margin-bottom:0vw;
    }
    @media only screen and (max-width: 414px) {
        width: 100vw;
        padding: 0vw 15vw;
        margin-bottom: 5vw;
    }
`
const CardElement = styled.div`
    
    margin-right: auto;
    width: 15vw;
    &:last-child{
        margin-right:0vw;
    }

    @media only screen and (max-width: 414px) {
        width: 35vw;
    }
`

const Flex = styled.div`
    display: flex;
`
const Center = styled.div`
    margin: auto;
    display: flex;
    @media only screen and (max-width: 414px) {
        display: block;
    }
`

interface Artists{
    concept: string []
    composition: string []
    illustration: string []
    miniature: string []
}



const Artists = ({concept, composition, illustration, miniature}: Artists) =>{
        console.log(concept);
        
    return (<>
    
        <ArtistElement>
            <CardElement>
                <TextElMessiri fontsize={0.8} textAlign ="center" color="#C0BAB1" fontsizeMobile={3.3} lineHeightMobil ={3.5}>Concept</TextElMessiri>
                <Flex>
                    <Center>
                        {concept.map((el: string ,index: number) =>{
                            console.log(el);
                            
                            return <Artist name={el} index={index} key={el}/>
                        })}
                    </Center>
                </Flex>
            </CardElement>
            
            <CardElement>
                <TextElMessiri fontsize={0.8} textAlign ="center" color="#C0BAB1" fontsizeMobile={3.3} lineHeightMobil ={3.5}>Miniature</TextElMessiri>
                <Flex>
                    <Center>
                        {miniature.map((el: string ,index: number) =>{
                            return <Artist name={el} index={index} key={el}/>
                        })}
                    </Center>
                </Flex>

            </CardElement>
        </ArtistElement>

        <ArtistElement>
            <CardElement>
                <TextElMessiri fontsize={0.8} textAlign ="center" color="#C0BAB1" fontsizeMobile={3.3} lineHeightMobil ={3.5}>Splash Art Composition </TextElMessiri>
                <Flex>
                    <Center>
                        {composition.map((el: string ,index: number) =>{
                            return <Artist name={el} index={index} key={el}/>
                        })}
                    </Center>
                </Flex>

            </CardElement>
            <CardElement>
                <TextElMessiri fontsize={0.8} textAlign ="center" color="#C0BAB1" fontsizeMobile={3.3} lineHeightMobil ={3.5}>Splash Art & Pixel Art</TextElMessiri>
                <Flex>
                    <Center>
                        {illustration.map((el: string ,index: number) =>{
                            return <Artist name={el} index={index} key={el}/>
                        })}
                    </Center>
                </Flex>
            </CardElement>
        </ArtistElement>
    </>)
}

export default Artists