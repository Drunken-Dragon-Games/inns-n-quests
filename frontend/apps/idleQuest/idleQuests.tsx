import LateralBar from "../utils/laterBar/lateralBar"
import NavBarApp from "../utils/navBar/navBarApp"
import Footer from "../utils/footer/footer"
import { Provider } from "react-redux"
import { generalStore } from "../../features/generalReducer"
import IdleQuestApp  from "./idleQuest/IdleQuestApp"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const IdleQuest = ():JSX.Element =>{ 
    
    return(<>
                {/* <LateralBar/>
                <NavBarApp/> */}
                <Provider store = {generalStore}>
                    <DndProvider backend={HTML5Backend}>
                        <IdleQuestApp/>
                    </DndProvider>
                </Provider>
                {/* <Footer/> */}
    </>)
}

export default IdleQuest