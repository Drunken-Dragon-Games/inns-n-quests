import { combineReducers } from "redux";
import { playerReducer } from "../apps/console/features/player";
import { questBoardGeneralReducer } from "../apps/availableQuest/quest-board-state";

export const idleQuests = combineReducers({
    player: playerReducer,
    questBoard : questBoardGeneralReducer,
})