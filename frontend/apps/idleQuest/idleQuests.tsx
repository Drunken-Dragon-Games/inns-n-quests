import { Provider } from "react-redux"
import { generalStore } from "../../features/generalReducer"
import IdleQuestsApp  from "./idleQuest/idle-quests-app"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const IdleQuest = ():JSX.Element =>
    <Provider store={generalStore}>
        <DndProvider backend={HTML5Backend}>
            <IdleQuestsApp />
        </DndProvider>
    </Provider>

export default IdleQuest