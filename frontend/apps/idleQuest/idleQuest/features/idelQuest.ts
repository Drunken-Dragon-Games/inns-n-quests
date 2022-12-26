import { combineReducers } from "redux";
import { adventurersGeneralReducer } from "../apps/console/features/adventurers";
import { playerReducer } from "../apps/console/features/player";
import { navigationConsoleReducer } from "../apps/console/features/navigationConsole";
import { inProgressGeneralReducer } from "../apps/inProgressQuests/features/inProgressQuest";
import { availableQuestGeneralReducer } from "../apps/availableQuest/features/availableQuest";
import { navigatorAppReducer } from "./interfaceNavigation";

export const idleQuest = combineReducers({
    adventurers: adventurersGeneralReducer,
    player: playerReducer,
    navigationConsole: navigationConsoleReducer,
    questsInProgress: inProgressGeneralReducer,
    questAvailable : availableQuestGeneralReducer,
    navigator: navigatorAppReducer
    
})