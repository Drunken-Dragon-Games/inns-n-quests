import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import AccountSettingPage from "./accountSettings/accountSettingsPage"
import { Provider } from "react-redux"
import { generalStore } from "../../features/generalReducer"


const AccountSettingsApp = (): JSX.Element=>{
    return(<>
        
        <LateralBar/>
        <NavBarApp/>

        <Provider store = {generalStore}>
            <AccountSettingPage/>
        </Provider>
    </>)
    
}

export default AccountSettingsApp