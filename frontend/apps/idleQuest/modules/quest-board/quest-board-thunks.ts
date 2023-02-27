import { compose } from "@reduxjs/toolkit"
import { axiosCustomInstance } from "../../../../axios/axiosApi"
import { tagAvailableQuest, withTokenRefresh } from "../../dsl"
import { IdleQuestsThunk } from "../../idle-quests-state"
import { addVisualQuestData } from "../inventory"
import { addAvailableQuests } from "./quest-board-state"

export const getAvailableQuests = (): IdleQuestsThunk => async (dispatch) => 
    await withTokenRefresh(async () => {
        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        const availableQuests = response.data
            .map(compose(addVisualQuestData, tagAvailableQuest))
        dispatch(addAvailableQuests(availableQuests))
    })
