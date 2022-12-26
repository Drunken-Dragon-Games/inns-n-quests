
import { CardSection, DataAdventurer, FilterSection, ButtonContainer, CardSectionMobile, NavbarMobile, ExplorerDesktop, LoadingSection, AggregatedRarity } from '../complex'
import { Loading, FullScreen, ShadowWrapper, FilterMobilSection, PageImageMobile } from '../basic_components'
import styled from "styled-components"

const AppWrapper = styled.div`
    width: 100%;
    height: auto;
    padding: 30vw 0vw 25vw 0vw;
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

const ExplorerMovil = (): JSX.Element =>{
     return(<>
            <AppWrapper>
                <CardSectionMobile/>
                <FilterMobilSection/>
                <DataAdventurer/>
                <AggregatedRarityPosition>
                    <AggregatedRarity/>
                </AggregatedRarityPosition>
            </AppWrapper>
     
     </>)
}

export default ExplorerMovil