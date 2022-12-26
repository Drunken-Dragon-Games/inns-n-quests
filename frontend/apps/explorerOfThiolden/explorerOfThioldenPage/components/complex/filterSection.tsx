import { Filter } from "."
import { TextElMessiri } from "../basic_components"
import styled from "styled-components"
import Image from "next/image"
import { LinkDisable } from "../../../../utils/components/basic_components"
import { useRedirect } from "../../../../utils/hooks" 
import { Button } from "../../../../utils/components/basic_components";

const FilterSectionComponent = styled.div`
    width: 18.906vw;
    height: 14.010vw;
    position: relative;
    padding: 0vw 2.604vw;
    z-index: 5;
`

const TitleWrapper = styled.div`

`

const LeftCorner =styled.div`
    position: absolute;
    left: 0vw;
    top: 0vw;
    width: 3.776vw;
    height: 3.776vw;
`

const RightCorner =styled.div`
    position: absolute;
    right: 0vw;
    top: 0vw;
    width: 3.776vw;
    height: 3.776vw;
`

const CenterImage =styled.div`
    position: absolute;
    right: 4.167vw;
    top: 5.521vw;
    width: 18.229vw;
    height: 10.573vw;
    display: flex;
`

const Center = styled.div`
    margin: auto 4vw;
`

const FilterWrapper = styled.div`
    margin-left: 1vw;
`


const FilterSection = () =>{
    
        
    return (
        <>
            <FilterSectionComponent>
                <LeftCorner>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter/filter_left_corner.png"
                        alt = "filter left corner drunken dragon"   
                        layout = "responsive" 
                        width={2000} 
                        height={2000}
                    />
                </LeftCorner>

                <RightCorner>
                    <Image 
                        src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter/filter_right_corner.png"
                        alt = "filter left corner drunken dragon"   
                        layout = "responsive" 
                        width={2000} 
                        height={2000}
                    />
                </RightCorner>

                <CenterImage>

                    <Center>
                        <LinkDisable url="https://www.jpg.store/collection/drunkendragon?tab=minting" openExternal={true}>
                            <Button action ={ () =>null} size="big">MINT NOW!</Button>
                        </LinkDisable>
                        
                    </Center>
                </CenterImage>

                <TitleWrapper>
                    <TextElMessiri color="#FFFFFF" textAlign="center" fontsize={1.302}>Search by</TextElMessiri>
                </TitleWrapper>

                <FilterWrapper>
                    <Filter/>
                </FilterWrapper>
                
            </FilterSectionComponent>
        </>
    )
}

export default FilterSection