import styled from "styled-components"
import Collection from "../basic_components/collection"
import { TextOswald } from "../../../../utils/components/basic_components"
import Image from "next/image"

const CollectionsSectionContainer = styled.section`
    width: 100%;
    margin-top: -5.208vw;
    padding: 5vw 10vw 2vw 11.8vw;
    

    @media only screen and (max-width: 414px) {
        display: block;
        padding: 5vw;
    }

    @media only screen and (min-width: 2560px) {
        padding: 0vw;
    }
`

const CollectionsWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    gap: 1.563vw;

    @media only screen and (max-width: 414px) {
        display: block
    }
`

const CollectionsHeaderContainer = styled.div`
    margin-bottom: 2.083vw;
    @media only screen and (max-width: 414px) {
        margin-bottom: 8.083vw;
    }
`

const CollectionsDecoration = styled.div`
    position: absolute;
    top: -7%;
    left: 5%;
    width: 25.521vw;
    height: 23.438vw;
    max-width: 653.338px;
    max-height: 600.013px;

    @media only screen and (max-width: 414px) {
        top: -5%;
        left: 0;
        width: 48.309vw;
        height: 44.366vw;
    }
`

const Center = styled.div`
    width: 100%;
    max-width: 2000px;
    position: relative;
    @media only screen and (min-width: 2560px) {
        margin: auto;
    }

`


const CollectionsSection = ():JSX.Element => {
    return (
    <CollectionsSectionContainer>
        <Center>
            <CollectionsDecoration>
                <Image
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/collections-decoration.svg"
                    width={1}
                    height={1}
                    layout="responsive"
                />
            </CollectionsDecoration>
            <CollectionsHeaderContainer>
                <TextOswald fontsize={3.125} fontsizeMobile={7.5} color="#CAC6BE" textAlign="center">EXPLORE ALL COLLECTIONS</TextOswald>
            </CollectionsHeaderContainer>
            <CollectionsWrapper>
                <Collection src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/coleccion_pixel_tile.webp" url="https://cnft.tools/pixeltiles"/>
                <Collection src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/coleccion_grandmasters.webp" url="https://cnft.tools/grandmasteradventurer"/>
                <Collection src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/coleccion_thiolden.webp" url="https://s2.drunkendragon.games/"/>
            </CollectionsWrapper>
        </Center>
    </CollectionsSectionContainer>)
}

export default CollectionsSection