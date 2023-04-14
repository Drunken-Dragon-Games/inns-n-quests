import { IFilteredAdventurers } from "../app/types.js";
import { XP_BALANCER, DS_BALANCER } from "../app/settings.js" 
import { calculateLevel } from '../adventurers/utils.js'


//////////////// FUNCTION THAT CALCULATES QUEST OUTCOME ///////////////////
/*
GETS ADVENTURER LEVEL AVERAGE
USES EQUATION TO CALCULATE OUTCOME
 */
function questOutcome(questDifficulty: number, questSlots: number, adventurerlevels: number[], requirementBonus: number): string {
    let levelSum: number = 0;
    adventurerlevels.forEach((adventurerLevel: number) => {
        levelSum += adventurerLevel;
    });

    const averageLevel: number = levelSum/questSlots;

    const randomNum: number = Math.random();

    const chanceOfSuccess: number = (0.8 - (questDifficulty - averageLevel)/10);    
    const chanceWithBonus = chanceOfSuccess + requirementBonus;
    
    if (randomNum <= chanceWithBonus) {
        return "succeeded"
    }
    return "failed"
}

//////////////// FUNCTION THAT SETS UP BUCKETS FOR QUEST FILTERING ///////////////////
/*
CALCULATES LEVEL DIFFERENCE BETWEEN MIN AND MAX
BASED ON THE DIFFERENCE THE FUNCTION CREATES 1 TO 5 BUCKETS
 */
const handleQuestsByAdventurerLevel = (minXP: number, maxXp: number): IFilteredAdventurers[] => {
    let minLevel: number = calculateLevel(minXP);
    let maxLevel: number = calculateLevel(maxXp);
    let levelDifference: number = maxLevel - minLevel; 
    let numberOfGroups: number = 5;
    let adventurerFilter: IFilteredAdventurers[] = new Array();

    if (levelDifference == 0) return [{
        min_level: minLevel,
        max_level: maxLevel,
        adventurer_count: 0,
        average_level: 0,
        difficulty_offset: 2
    }]

    while (levelDifference / numberOfGroups < 1) {
        numberOfGroups--;
    }

    let levelStep: number = Math.round(levelDifference / numberOfGroups)

    for (let i = 0; i < numberOfGroups; i++) {
        adventurerFilter.push({
            min_level: minLevel + (i * levelStep),
            max_level:  (i + 1) == numberOfGroups ? maxLevel : minLevel + (i + 1) * (levelStep),
            adventurer_count: 0,
            average_level: 0,
            difficulty_offset: 2 + Math.ceil(i * 1.5)
        })
    }

    return adventurerFilter;
}

//////////////// CALCULATES REWARD MULTIPLICATOR ///////////////////
/*
CALCULATES CHANCE OF SUCCESS
IF THE CHANCE OF SUCCESS IS LOW ENOUGH MODIFIES MULTIPLICATOR
RETURNS MULTIPLICATOR
 */
const calculateRewardMultiplicator = (questDifficulty: number, partyLevel: number): number => {
    let multiplicator: number = 1;
    let chanceOfSuccess: number = 0.8 - (questDifficulty - partyLevel)/10;
    let multipNumber: number = Math.floor((.7 - chanceOfSuccess) / .1);
    if (chanceOfSuccess <= .6) {
        for (let i = 0; i < multipNumber; i++) {
            multiplicator += .5
        }
    }

    return multiplicator;
}

function calculateExperienceGained(currentLevel: number, questLevel: number): number {
    let experience: number = XP_BALANCER*((currentLevel * 100) + (currentLevel * 100)*(questLevel - currentLevel)/10);
    if (experience < 0) {
        return 0;
    }
    return experience;
}

function calculateDragonSilver(questLevel: number): number {
    return DS_BALANCER*(questLevel);
}

export {
    questOutcome,
    handleQuestsByAdventurerLevel,
    calculateRewardMultiplicator,
    calculateDragonSilver,
    calculateExperienceGained,
}