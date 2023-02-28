import { useInventorySelector } from "../../inventory-state"
import AdventurerSplashArt from "./adventurer-splash-art"
import QuestSheet from "./quest-sheet"

const ActivityView = () => {
    const state = useInventorySelector(state => ({
        selection: state.activitySelection,
        selectedParty: state.selectedParty,
    })) 
    return <div onClick={(e) => e.stopPropagation()}>
        { state.selection?.ctype === "taken-quest" || state.selection?.ctype === "available-quest" ?
            <QuestSheet
                quest={state.selection}
                adventurerSlots={state.selectedParty}
            />

        : state.selection?.ctype === "adventurer" ?
            <AdventurerSplashArt adventurer={state.selection} />

        : <></> }
    </div>
}

export default ActivityView