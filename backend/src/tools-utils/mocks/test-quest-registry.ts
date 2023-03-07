import { StakingQuestRegistry } from "../../service-idle-quests/state/staking-quests-registry";
import { empty } from "../../service-idle-quests/game-vm";

export const testQuestRegistry: StakingQuestRegistry = {
    "quest-1": {
        questId: "quest-1",
        name: "Quest 1",
        description: "Quest 1 description",
        location: "Auristar",
        requirements: empty,
        slots: 4,
    }
}