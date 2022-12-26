import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import ExplorerOfThioldenApp from "./explorerOfThioldenPage/explorerOfThioldenApp"
import { Provider } from "react-redux"
import { generalStore } from "../../features/generalReducer"

const ExplorerOfThoiolden = ():JSX.Element =>{ 
    
    return(<>
                <LateralBar/>
                <NavBarApp/>
                <Provider store = {generalStore}>
                    <ExplorerOfThioldenApp/>
                </Provider>
                <Footer/>
    </>)
}

export default ExplorerOfThoiolden