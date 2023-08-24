import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import { CollectionState, CollectionStore } from "./collection-state"
import { useSelector } from "react-redux"
import { DisplayView } from "./display/display-view"
import { useEffect } from "react"
import { collectionTransitions } from "./collection-transitions"
import { Provider } from "react-redux"
import { FilterView } from "./filter/filter-view"
import styled from "styled-components"
import { PaginationView } from "./pagination/pagination-view"
import { MortalView } from "./mortal-display/mortal-view"
import { DashboardView } from "./dashboard/calloction-dashboard-view"

const Container = styled.div`
  position: relative;
  margin-left: 105px;
  margin-bottom: 75px;
  min-height: 850px;
  display: grid;
  grid-template-columns: 10vw 1fr;
`;

const CollectionComponent = () =>{
    const { mortalItems, collectionItems, collectionCache, filter, status, displayArtType } = useSelector((state: CollectionState) => ({
            collectionItems: state.displayedCollectionItems,
            mortalItems: state.mortalCollectionItems,
            collectionCache: state.collectionCache,
            filter: state.collectionFilter,
            status: state.collectionFetchingState,
            displayArtType: state.displayArtStyle
    }))
    useEffect(() => {
      collectionTransitions.setDisplayCollection(collectionCache, filter)
      collectionTransitions.setMortalCollection()
    }, [])
    return(
    <Container>
      <DashboardView status={status} artType={displayArtType}></DashboardView>
      <MortalView collectionItems={mortalItems}/>
      <FilterView />
      <DisplayView collectionItems={collectionItems} artType={displayArtType}/>
      <div style={{ gridColumn: "2", gridRow: "3" }}>
        <PaginationView filter={filter} collectionCache={collectionCache} />
      </div>
    </Container>
    )
}

const CollectionView = ():JSX.Element =>{ 
    
    return(<>
                <LateralBar/>
                <NavBarApp/>
                <Provider store={CollectionStore}>
                    <CollectionComponent/>
                </Provider>
                <Footer/>
    </>)
}

export default CollectionView