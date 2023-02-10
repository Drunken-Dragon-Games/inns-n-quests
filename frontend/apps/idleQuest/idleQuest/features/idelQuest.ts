import { combineReducers } from "redux";
import { playerReducer } from "../apps/console/features/player";
import { navigationConsoleReducer } from "../apps/console/features/navigationConsole";
import { questBoardGeneralReducer } from "../apps/availableQuest/quest-board-state";

export const idleQuests = combineReducers({
    player: playerReducer,
    navigationConsole: navigationConsoleReducer,
    questBoard : questBoardGeneralReducer,
})