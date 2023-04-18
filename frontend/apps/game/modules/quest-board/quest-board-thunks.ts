import IdleQuestsApi from "../../idle-quests-api"
import { NotificationsApi } from "../notifications"
import { addAvailableEncounters, addAvailableQuests, QuestBoardThunk } from "./quest-board-state"

export const getAvailableQuests = (): QuestBoardThunk => async (dispatch) => {
    const response = await IdleQuestsApi.getAvailableStakingQuests()
    if (response.status == "ok") {
        dispatch(addAvailableQuests(response.availableQuests))
    } else {
        NotificationsApi.notify(`Error getting available quests: ${response.status}`, "alert")
    }
}

export const getAvailableEncounters = (location: string): QuestBoardThunk => async (dispatch) => {
    const response = await IdleQuestsApi.getAvailableEncounters(location)
    if (response.status == "ok") {
        dispatch(addAvailableEncounters(response.availableEncounters))
    } else {
        NotificationsApi.notify(`Error getting available encounters: ${response.status}`, "alert")
    }
}