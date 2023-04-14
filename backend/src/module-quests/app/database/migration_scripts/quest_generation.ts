import { NARRATIVES, RARITES, MONSTERS, REWARDS } from "../../metadata/quest_data.js";
import { INarrative, IRarity, IRewards } from "../../types.js"
import { IQuest, Quest } from "../../../quests/models.js";
import { calculateDragonSilver } from "../../../quests/utils.js"
import { getRandomElement } from "../../utils.js"
import { Optional } from 'sequelize'
import { getNumberInRange } from "../../utils.js"

async function generateQuests(questNumber: number){
    let quests = new Array;
    for (let i = 0; i < questNumber; i++) {        
        let [rarity, monster, place, narrative, reward, rewardModifier]: any = generateQuestSetup();
        let questData = generateQuestData(
            rarity,
            monster,
            place,
            narrative,
            reward,
            rewardModifier
        )
        quests.push(questData);
    }

    try {
        console.log("Loading quest data to db...");
        await Quest.bulkCreate(quests as Optional<IQuest, 'id'>[]);
        console.log("Quest data added to db")
        console.log("Quest generation succeeded");
        
    } catch (error) {
        console.log("Error generating quests")
    }
    
    return null;
}


function generateQuestSetup() {
    let randomNumber: number = Math.random();
    let rarity: IRarity | undefined = RARITES.find(rarity => rarity.percentage >= randomNumber);
    
    if(rarity == undefined){
        return null
    }

    let monsterType = getRandomElement(Object.keys(rarity.monsters));    

    let monsterTypeGroup: string = rarity.monsters[monsterType]
    let monsterList = MONSTERS[monsterType][monsterTypeGroup]
    let monster: string = getRandomElement(monsterList);  

    let place: string = getRandomElement(MONSTERS[monsterType]["places"])

    let narrative = NARRATIVES.find(narrative => {
        return rarity?.name == narrative.rarity && monsterTypeGroup == narrative.monster
    });
    if (narrative == undefined) return null

    let rewardRandomNumber = Math.random()
    let reward = REWARDS.find((reward: IRewards) => reward.probability >= rewardRandomNumber)!
    let rewardModifier = getNumberInRange(reward.min_reward, reward.max_reward, false);
    return [rarity, monster, place, narrative, reward.name, rewardModifier]
}

function generateQuestData(
    rarity: IRarity,
    monster: string,
    place: string,
    narrative: INarrative,
    reward: string,
    rewardModifier: number
) {
    let questName: string = narrative.name;
    let questDifficulty: number = getNumberInRange(rarity.min_level_required, rarity.max_level_required);
    let questRewardXP: number = rarity.xp_base_modifier;
    let questRewardDs: number = Math.round(calculateDragonSilver(questDifficulty) * rewardModifier);
    let questSlots: number = getNumberInRange(2, 5);
    let questDuration: number = getNumberInRange(rarity.min_duration, rarity.max_duration);
    let questDescription: string = narrative.description
    .replace("<monster>", `<b>${monster}</b>`)
    .replace("<location>", `<b>${place}</b>`)
    .replace("<reward-amount>", `<b>${questRewardDs.toString()}</b>`)
    .replace("<reward-type>", `<b>${reward}</b>`);

    let questData = {
        name: questName,
        description: questDescription,
        reward_ds: questRewardDs,
        reward_xp: questRewardXP,
        difficulty: questDifficulty,
        slots: questSlots,
        rarity: rarity.name,
        duration: questDuration
    }
    return questData
}

export default generateQuests