import { AvailableEncounter, AvailableStakingQuest } from "../../../common"
import InventoryApi from "../inventory/inventory-api"
import { clearAvailableEncounters, clearAvailableQuests, questBoardStore, removeAvailableEncounter, removeAvailableQuest, toggleQuestBoard } from "./quest-board-state"
import { getAvailableEncounters, getAvailableQuests } from "./quest-board-thunks"

const QuestBoardTransitions = {

    onFetchAvailableQuests: () =>
        questBoardStore.dispatch(getAvailableQuests()),

    onClearAvailableQuests: () => 
        questBoardStore.dispatch(clearAvailableQuests()),
    
    onClickAvailableQuest: (availableQuest: AvailableStakingQuest) => 
        InventoryApi.selectQuest(availableQuest),

    onRemoveAvailableQuest: (availableQuest: AvailableStakingQuest) => 
        questBoardStore.dispatch(removeAvailableQuest(availableQuest)),
    


    onFetchAvailableEncounters: () =>
        questBoardStore.dispatch(getAvailableEncounters("Auristar")),

    onClearAvailableEncounters: () =>
        questBoardStore.dispatch(clearAvailableEncounters()),

    onClickAvailableEncounter: (availableEncounter: AvailableEncounter) => {},
        //InventoryApi.selectQuest(availableEncounter),
    
    onRemoveAvailableEncounter: (availableEncounter: AvailableEncounter) =>
        questBoardStore.dispatch(removeAvailableEncounter(availableEncounter)),

    

    onToggleQuestBoard: (open?: boolean) => 
        questBoardStore.dispatch(toggleQuestBoard({ open })),
}

export default QuestBoardTransitions
