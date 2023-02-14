import { Provider } from "react-redux"
import { idleQuestsStore } from "./idle-quests-state"
import IdleQuestsView from "./idle-quests-view"

const IdleQuestsApp = () =>
    <Provider store={idleQuestsStore}>
        <IdleQuestsView />
    </Provider>

export default IdleQuestsApp