import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri } from "."

const AdventurerNameComponent = styled.div`
    width: 100%;
    height: 6vw;

    @media only screen and (max-width: 414px) {
        width: 100%;
        height: 35vw;
        padding: 0vw 15vw;
    }
`

const Center = styled.div`
    display: flex;
    width: 100%;
`

const ImageWrapper = styled.div`
    width: 11.719vw;
    height: 2.013vw;
    margin: auto;

    @media only screen and (max-width: 414px) {
        width: 60vw;
        height: 3vw;
    }
`

const NameWrapper = styled.div`
    display: flex;
    margin: 0vw auto;
`

const MarginTop = styled.div`
    margin-top: 0.469vw;

    @media only screen and (max-width: 414px) {
        margin: 10vw 0vw 3vw 0vw;
    }
`


interface AdventurerName{
    name: string
    number: string
    title: string
}
const AdventurerName = ({name, number, title}:AdventurerName) => {

    const titleAndName = `${name}, ${title}`
    const numberString = `#${number}`

    return (<>

        <AdventurerNameComponent>

            <Center>
                <ImageWrapper>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/adventurer_data/adventurer_name.svg"
                        alt = "ornament"   
                        layout = "responsive" 
                        width={225} 
                        height={39}
                    />
                </ImageWrapper>
            </Center>

            <MarginTop>
                <Center>
                    <NameWrapper>
                            <TextElMessiri color="#C0BAB1" fontsize={1.1} textAlign="center" fontsizeMobile={4.5} lineHeightMobil ={4.7}>{titleAndName}</TextElMessiri>
                    </NameWrapper>
                    
                </Center>
            </MarginTop>
            <TextElMessiri color="#FFFFFF" fontsize={1.1} textAlign="center" fontsizeMobile={4.5}>{numberString}</TextElMessiri>
        </AdventurerNameComponent>
        
    </>)
}

export default AdventurerName