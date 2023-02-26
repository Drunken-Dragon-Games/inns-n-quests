import AdventurerSplashArt from "../../common-components/adventurer-splash-art";
import { QuestSheet } from "../../common-components/quest-sheet";
import { InventoryState } from "./inventory-state";
import { InventoryTransitions } from "./inventory-transitions";

const InventoryActivityView = ({ state, transitions }: { state: InventoryState, transitions: InventoryTransitions }) => {

    if (state.selection && state.selection.ctype === "taken-quest")
        return <QuestSheet
            quest={state.selection}
            adventurerSlots={state.selectedParty}
            onSign={transitions.onSignQuest}
            onUnselectAdventurer={transitions.onUnselectAdventurer}
        />

    else if (state.selection?.ctype === "adventurer")
        return <AdventurerSplashArt adventurer={state.selection} />

    else return <></>
}

export default InventoryActivityView