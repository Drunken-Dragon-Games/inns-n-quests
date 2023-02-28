import { AvailableQuest } from "../../common";
import { inventoryStore } from "./inventory-state";
import InventoryTransitions from "./inventory-transitions";

const InventoryApi = {

    isOpen: () => 
        inventoryStore.getState().open,
    
    activeActivity: () =>
        inventoryStore.getState().activitySelection?.ctype,

    selectQuest: (quest: AvailableQuest) =>
        InventoryTransitions.onSelectQuest(quest),
    
    signQuest: () =>
        InventoryTransitions.onSignQuest(),
    
    toggleInventory: () =>
        InventoryTransitions.onToggleInventory(),
    
    closeActivity: () =>
        InventoryTransitions.closeActivity(),
}

export default InventoryApi
