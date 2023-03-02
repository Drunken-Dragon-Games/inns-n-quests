import { compose } from "@reduxjs/toolkit"
import { axiosCustomInstance } from "../../../../axios/axiosApi"
import { addVisualQuestData, tagAvailableQuest, withTokenRefresh } from "../../common"
import IdleQuestsApi from "../../idle-quests-api"
import { NotificationsApi } from "../notifications"
import { addAvailableQuests, QuestBoardThunk } from "./quest-board-state"

export const getAvailableQuests = (): QuestBoardThunk => async (dispatch) => {
    const response = await IdleQuestsApi.getAvailableQuests()
    if (response.status == "ok") {
        const availableQuests = response.quests
            .map(compose(addVisualQuestData, tagAvailableQuest))
        dispatch(addAvailableQuests(availableQuests))
    } else {
        NotificationsApi.notify(`Error getting available quests: ${response.status}`, "alert")
    }
}
