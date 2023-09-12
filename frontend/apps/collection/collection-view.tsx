import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import { CollectionState, CollectionStore } from "./collection-state"
import { useSelector } from "react-redux"
import { DisplayView } from "./display/display-view"
import { useEffect, useState } from "react"
import { collectionTransitions } from "./collection-transitions"
import { Provider } from "react-redux"
import { FilterView } from "./filter/filter-view"
import styled from "styled-components"
import { PaginationView } from "./pagination/pagination-view"
import { MortalView } from "./mortal-display/mortal-view"
import { DashboardView } from "./dashboard/calloction-dashboard-view"
import { OswaldFontFamily, colors } from "../common"

const Container = styled.div<{ isMobile: boolean }>`
  width: 100vw;
  position: relative;
  margin-left: ${(props) => (props.isMobile ? "15px" : "105px")};
  margin-bottom: 75px;
  min-height: ${(props) => (props.isMobile ? "auto" : "850px")};
  display: ${(props) => (props.isMobile ? "block" : "grid")};
  grid-template-columns: ${(props) => (props.isMobile ? "none" : "11vw 1fr")};
  ${(props) => (props.isMobile ? "padding-top: 16vh;" : "")}
`;

const CollectionComponent = () =>{
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
      setIsMobile(window.innerWidth <= 768)
      const handleResize = () => setIsMobile(window.innerWidth <= 768)
      window.addEventListener("resize", handleResize)
      return () => {window.removeEventListener("resize", handleResize)}
    }, [])

    const { mortalItems, collectionItems, collectionCache, filter, status, displayArtType, mortalLocked, justLocked, isSyncing, weeklyEranings } = useSelector((state: CollectionState) => ({
            collectionItems: state.displayedCollectionItems,
            mortalItems: state.mortalCollectionItems,
            collectionCache: state.collectionCache,
            filter: state.collectionFilter,
            status: state.collectionFetchingState,
            displayArtType: state.displayArtStyle,
            mortalLocked: state.mortalLocked,
            justLocked: state.justLocked,
            isSyncing: state.isSyncing,
            weeklyEranings: state.weeklyEarnings,
    }))
    useEffect(() => {
      collectionTransitions.setDisplayCollection(collectionCache, filter)
      collectionTransitions.setMortalCollection()
      collectionTransitions.getMortalCollectionLockedState()
      collectionTransitions.getWeeklyEarnings()
    }, [])
    return(
    <Container isMobile={isMobile}>
      <DashboardView status={status} artType={displayArtType} collectionItems={mortalItems} mortalLocked={mortalLocked} isSyncing={isSyncing} isMobile={isMobile} weeklyEranings={weeklyEranings}></DashboardView>
      <MortalView collectionItems={mortalItems} mortalLocked={mortalLocked} justLocked={justLocked} isMobile={isMobile}/>
      <FilterView isMobile={isMobile}/>
      <DisplayView collectionItems={collectionItems} artType={displayArtType} mortalLocked={mortalLocked} isMobile={isMobile}/>
      <div style={{ gridColumn: "2", gridRow: "3" }}>
        <PaginationView filter={filter} collectionCache={collectionCache} />
      </div>
    </Container>
    )
}

const CollectionView = ():JSX.Element =>{ 
    
    return(
    <>   
      <LateralBar/>
      <NavBarApp/>
      <Provider store={CollectionStore}>
          <CollectionComponent/>
      </Provider>
      <Footer/>
    </>)
}

export default CollectionView