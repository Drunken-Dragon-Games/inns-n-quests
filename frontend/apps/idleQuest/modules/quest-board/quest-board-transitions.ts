import { AvailableQuest } from "../../dsl"
import { IdleQuestsSnD } from "../../idle-quests-state"
import { clearAvailableQuests, removeAvailableQuest } from "./quest-board-state"
import { getAvailableQuests } from "./quest-board-thunks"

export type QuestBoardTransitions = {
    onFetchAvailableQuests: () => void
    onClearAvailableQuests: () => void
    onRemoveAvailableQuest: (availableQuest: AvailableQuest) => void
}

export const questBoardTransitions = ({ state, dispatch }: IdleQuestsSnD): QuestBoardTransitions => ({

    onFetchAvailableQuests: () => {
        dispatch(getAvailableQuests())
    },

    onClearAvailableQuests: () => {
        dispatch(clearAvailableQuests())
    },

    onRemoveAvailableQuest: (availableQuest: AvailableQuest) => {
        dispatch(removeAvailableQuest(availableQuest))
    },
})

