import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"

const CollectionComponent = () => 
    <>
    </>

const CollectionView = ():JSX.Element =>{ 
    
    return(<>
                <LateralBar/>
                <NavBarApp/>
                <CollectionComponent/>
                <Footer/>
    </>)
}

export default CollectionView