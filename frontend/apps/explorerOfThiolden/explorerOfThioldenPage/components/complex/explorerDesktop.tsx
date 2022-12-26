import { CardSection, DataAdventurer, FilterSection, ButtonContainer, AggregatedRarity, ImagePopup } from '.'
import styled from "styled-components"


const AppWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 50.250vw;
    margin: 0vw 0vw 7vw 0vw;
    max-width: 1920px;
`

const Center = styled.div`
    display: flex;
   
    
`

const DataAdventurerPosition = styled.div`
    margin-top: 4vw;
    height: auto;
`

const FilterSectionPosition = styled.div`
    margin-top: 4vw;
    margin-left: 3vw;
    height: auto;
    @media only screen and (max-width: 414px) {
        width: 100%;
    }
    position: relative;
`

const AggregatedRarityPosition = styled.div`
    margin-top: 3.5vw;
    margin-left: 0.781vw;
    z-index: -1;

    @media only screen and (max-width: 414px) {
        margin-top: 7vw;
        margin-left: 0vw;
    }
`
const ButtonContainerPosition = styled.div`

`

const ExplorerDesktop = (): JSX.Element =>{

    return (<>
    
            <AppWrapper>
                <Center>

           
                    <CardSection/>
                  
                    <DataAdventurerPosition>
                        <DataAdventurer/>
                    </DataAdventurerPosition> 
                  
                    <FilterSectionPosition>

                        <FilterSection/>
                            
                        <AggregatedRarityPosition>
                            <AggregatedRarity/>
                        </AggregatedRarityPosition>
                            
                        <ButtonContainerPosition>
                            <ButtonContainer/>
                        </ButtonContainerPosition>
                    
                    </FilterSectionPosition>
                </Center>
            </AppWrapper>

            

            <ImagePopup 
                width={35}
                height={47}
                name="roster"
                imgSrc="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/roster/all_character_Chart.jpg"
            />

            <ImagePopup 
                width={63}
                height={35}
                name="rarity_chart"
                imgSrc="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarity_char/rarity_chart.jpg"
            />
                    
    </>)
}

export default ExplorerDesktop