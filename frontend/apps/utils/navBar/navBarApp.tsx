import Navbar from "./navbar"
import { Provider } from "react-redux"
import { generalStore } from "../../../features/generalReducer"

const NavBarApp = (): JSX.Element => {
    return (<>
        <Provider store={generalStore}>
            <Navbar/>
        </Provider>
    
    </>)
}

export default NavBarApp 