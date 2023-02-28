import { compose } from "@reduxjs/toolkit"
import { axiosCustomInstance } from "../../../../axios/axiosApi"
import { addVisualQuestData, tagAvailableQuest, withTokenRefresh } from "../../common"
import { addAvailableQuests, QuestBoardThunk } from "./quest-board-state"

export const getAvailableQuests = (): QuestBoardThunk => async (dispatch) => 
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        const availableQuests = response.data
            .map(compose(addVisualQuestData, tagAvailableQuest))
        dispatch(addAvailableQuests(availableQuests))
    })
