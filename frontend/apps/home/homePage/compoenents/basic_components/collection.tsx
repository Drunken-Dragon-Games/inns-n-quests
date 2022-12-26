import styled from "styled-components"
import { SimpleButton, LinkDisable } from "../../../../utils/components/basic_components"
import Image from "next/image"

const CollectionsImageContainer = styled.div`
    width: 100%;
    margin-bottom: 1.302vw;

    @media only screen and (max-width: 414px) {
        margin-bottom: 5vw;
    }
`

const CollectionContainer = styled.div`
    flex: 1

`

const CollectionWrapper = styled.div`
    @media only screen and (max-width: 414px) {
        margin-bottom: 5vw;
    }
`

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    @media only screen and (max-width: 414px) {
        margin: 10vw 0vw;
    }
`

const Center = styled.div`
    margin: auto;
`
interface Collection {
    src: string
    url: string 
}

const Collection = ({
    src,
    url
}: Collection):JSX.Element => {
    return (
    
    <CollectionContainer>
        <CollectionWrapper>
            <CollectionsImageContainer>
                <Image
                    src={src}
                    width={9}
                    height={11}
                    layout="responsive"
                />    
            </CollectionsImageContainer>

            <ButtonContainer>
                <Center>
                    <LinkDisable url={url} openExternal = {true}>
                        <SimpleButton action={() => null}>Explore Collection</SimpleButton>
                    </LinkDisable>
                </Center>
            </ButtonContainer>
            
        </CollectionWrapper>
    </CollectionContainer>)
}

export default Collection