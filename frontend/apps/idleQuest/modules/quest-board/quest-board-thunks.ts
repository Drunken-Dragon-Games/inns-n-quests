import IdleQuestsApi from "../../idle-quests-api"
import { NotificationsApi } from "../notifications"
import { addAvailableQuests, QuestBoardThunk } from "./quest-board-state"

export const getAvailableQuests = (): QuestBoardThunk => async (dispatch) => {
    const response = await IdleQuestsApi.getAvailableQuests()
    if (response.status == "ok") {
        dispatch(addAvailableQuests(response.availableQuests))
    } else {
        NotificationsApi.notify(`Error getting available quests: ${response.status}`, "alert")
    }
}
