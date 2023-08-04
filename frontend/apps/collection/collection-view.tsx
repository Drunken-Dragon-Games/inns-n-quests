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

const Container = styled.div`
  position: relative;
  margin-left: 105px;
`;

const CollectionComponent = () =>{
    const { collectionItems } = useSelector((state: CollectionState) => ({
            collectionItems: state.collectionItems,
    }))
    useEffect(() => {collectionTransitions.getCollection()}, [])
    return(
    <Container>
      <FilterView />
      <DisplayView collectionItems={collectionItems} />
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