import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import { CollectionState, CollectionStore } from "./collection-state"
import { useSelector } from "react-redux"
import { DisplayView } from "./display/display-view"
import { useEffect } from "react"
import { collectionTransitions } from "./collection-transitions"
import { Provider } from "react-redux"

const CollectionComponent = () =>{
    const { collectionItems } = useSelector((state: CollectionState) => ({
            collectionItems: state.collectionItems,
    }))
    useEffect(() => {collectionTransitions.getCollection()}, [])
    return(
    <>  
        <DisplayView collectionItems={collectionItems}/>
    </>
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