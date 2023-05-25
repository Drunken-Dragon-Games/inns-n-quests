import { AvailableStakingQuest } from "../../../common"
import { questBoardStore } from "./quest-board-state"
import QuestBoardTransitions from "./quest-board-transitions"

const QuestBoardApi = {

    isOpen: () =>
        questBoardStore.getState().open,

    toggleQuestBoard: () =>
        QuestBoardTransitions.onToggleQuestBoard(),

    removeAvailableQuest: (quest: AvailableStakingQuest) => 
        QuestBoardTransitions.onRemoveAvailableQuest(quest)
}

export default QuestBoardApi
