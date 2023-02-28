import { AvailableQuest } from "../../common"
import InventoryApi from "../inventory/inventory-api"
import { clearAvailableQuests, questBoardStore, removeAvailableQuest, toggleQuestBoard } from "./quest-board-state"
import { getAvailableQuests } from "./quest-board-thunks"

const QuestBoardTransitions = {

    onFetchAvailableQuests: () =>
        questBoardStore.dispatch(getAvailableQuests()),

    onClearAvailableQuests: () => 
        questBoardStore.dispatch(clearAvailableQuests()),
    
    onClickAvailableQuest: (availableQuest: AvailableQuest) =>
        InventoryApi.selectQuest(availableQuest),

    onRemoveAvailableQuest: (availableQuest: AvailableQuest) => 
        questBoardStore.dispatch(removeAvailableQuest(availableQuest)),

    onToggleQuestBoard: (open?: boolean) => 
        questBoardStore.dispatch(toggleQuestBoard({ open })),
}

export default QuestBoardTransitions
