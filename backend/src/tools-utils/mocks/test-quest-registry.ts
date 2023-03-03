import { QuestRegistry } from "../../registry-quests";
import { empty } from "../../service-idle-quests/game-vm";

export const testQuestRegistry: QuestRegistry = {
    "quest-1": {
        questId: "quest-1",
        name: "Quest 1",
        description: "Quest 1 description",
        location: "Auristar",
        requirements: empty,
        slots: 4,
    }
}