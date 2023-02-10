import { combineReducers } from "redux";
import { adventurersGeneralReducer } from "../apps/console/features/adventurers";
import { playerReducer } from "../apps/console/features/player";
import { navigationConsoleReducer } from "../apps/console/features/navigationConsole";
import { inProgressGeneralReducer } from "../apps/inProgressQuests/features/inProgressQuest";
import { questBoardGeneralReducer } from "../apps/availableQuest/features/quest-board";

export const idleQuests = combineReducers({
    adventurers: adventurersGeneralReducer,
    player: playerReducer,
    navigationConsole: navigationConsoleReducer,
    questsInProgress: inProgressGeneralReducer,
    questBoard : questBoardGeneralReducer,
})