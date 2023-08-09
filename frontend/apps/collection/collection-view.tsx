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

const Container = styled.div`
  position: relative;
  margin-left: 105px;
  margin-bottom: 75px;
  min-height: 850px;
`;

const CollectionComponent = () =>{
    const { mortalItems, collectionItems, collectionCache, filter } = useSelector((state: CollectionState) => ({
            collectionItems: state.displayedCollectionItems,
            mortalItems: state.mortalCollectionItems,
            collectionCache: state.collectionCache,
            filter: state.collectionFilter
    }))
    useEffect(() => {
      collectionTransitions.setDisplayCollection(collectionCache, filter)
      collectionTransitions.setMortalCollection()
    }, [])
    return(
    <Container>
      <MortalView collectionItems={mortalItems}/>
      <FilterView />
      <DisplayView collectionItems={collectionItems}/>
      <PaginationView filter={filter} collectionCache={collectionCache}/>
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