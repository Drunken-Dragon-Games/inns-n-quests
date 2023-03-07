import { useSelector } from "react-redux"
import _ from "underscore"
import { InventoryState } from "../../inventory-state"
import CharacterSplashArt from "./character-splash-art"
import QuestSheet from "./quest-sheet"

const ActivityView = () => {
    const state = useSelector((state: InventoryState) => ({
        selection: state.activitySelection,
        selectedParty: state.selectedParty,
    }), _.isEqual) 
    return <div onClick={(e) => e.stopPropagation()}>
        { state.selection?.ctype === "taken-staking-quest" || state.selection?.ctype === "available-staking-quest" || state.selection?.ctype === "available-encounter" ?
            <QuestSheet
                quest={state.selection}
                adventurerSlots={state.selectedParty}
            />

        : state.selection?.ctype === "character" ?
            <CharacterSplashArt character={state.selection} />

        : <></> }
    </div>
}

export default ActivityView