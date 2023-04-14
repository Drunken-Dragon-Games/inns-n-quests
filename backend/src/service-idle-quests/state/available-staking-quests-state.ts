import { IQMeatadataObjectBuilder } from "../game-vm/index.js";
import { AvailableStakingQuest } from "../models.js";
import { pickRandomQuestsByLocation, StakingQuestRegistry } from "./staking-quests-registry.js";

export class AvailableStakingQuestState {

    constructor(
        private readonly questsRegistry: StakingQuestRegistry,
        private readonly objectBuilder: IQMeatadataObjectBuilder,
    ) {}

    async getAvailableStakingQuests(location: string, quantity: number = 20): Promise<AvailableStakingQuest[]> {
        return pickRandomQuestsByLocation(location, quantity, this.questsRegistry, this.objectBuilder.rand)
            .map(q => ({ ...q, ctype: "available-staking-quest" }))
    }
}