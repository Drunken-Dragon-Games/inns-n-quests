import { combineReducers } from "redux";
import { playerReducer } from "../apps/console/features/player";
import { navigationConsoleReducer } from "../apps/console/features/navigationConsole";
import { inProgressGeneralReducer } from "../apps/inProgressQuests/features/inProgressQuest";
import { questBoardGeneralReducer } from "../apps/availableQuest/features/quest-board";

export const idleQuests = combineReducers({
    player: playerReducer,
    navigationConsole: navigationConsoleReducer,
    questsInProgress: inProgressGeneralReducer,
    questBoard : questBoardGeneralReducer,
})