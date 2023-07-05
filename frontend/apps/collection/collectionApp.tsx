import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import CollectionComponent from "./collectionComponent/collectionComponent"

const CollectionApp = ():JSX.Element =>{ 
    
    return(<>
                <LateralBar/>
                <NavBarApp/>
                <CollectionComponent/>
                <Footer/>
    </>)
}

export default CollectionApp