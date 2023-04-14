import { Quest } from "../../../quests/models/index.js"
import { getRandomElement, getNumberInRange } from "../../utils.js"
import { IQuestRequirements, ICharacterRequirements } from "../../../quests/models/index.js"
import { races, classes } from "../../metadata/dd-data.js"
import sequelize, { Sequelize, Transaction } from "sequelize"

type RequirementType = "all" | "balanced" | "character"

/**
 * Generate from 1 to 3 normal character requirements
 * @param numberOfRequirements Number of character requirements to be created (Should not be more than 3)
 * @returns Quest Requirement
 */
 const generateRequirement = (numberOfRequirements: number): IQuestRequirements => {
    let requirement: IQuestRequirements = {
        character: []
    }
    for (let i = 0; i < numberOfRequirements; i++) {        
        const hasClass = Boolean(Math.round(Math.random())) // Gets random bool value
        let hasRace = Boolean(Math.round(Math.random()))
        if(!hasClass && !hasRace) {
            hasRace = true
        }
        let character: ICharacterRequirements = {}
        hasClass ? character["class"] = getRandomElement(classes) : null
        hasRace ? character["race"] = getRandomElement(races) : null
        requirement["character"]!.push(character)
    }
    return requirement
}

/**
 * Generates a balanced party requirement
 * @returns Quest Requirement
 */
const generatePartyBalanceRequirement = (): IQuestRequirements => {
    const balancedRequirement: IQuestRequirements = {
        character: [],
        party: {
            balanced: true
        }
    }
    return balancedRequirement
}

/**
 * Generates an "All" requirement data structure
 * @returns Quest Requirement
 */
 const generateAllRequirement = (): IQuestRequirements => {
    let requirement: IQuestRequirements = new Object()
    let hasClass = Boolean(Math.round(Math.random())) // Gets random bool value
    const hasRace = Boolean(Math.round(Math.random()))
    if(!hasClass && !hasRace) {
        hasClass = true
    }
    requirement["all"] = true
    requirement["character"] = new Array()
    let character: ICharacterRequirements = {}
    hasClass ? character["class"] = getRandomElement(classes) : null
    hasRace ? character["race"] = getRandomElement(races) : null
    requirement["character"].push(character)
    return requirement
}



/**
 * Gets a random type of requirement
 * @param requirementType Type of requirement to be generated
 * @returns Quest requirement
 */
const getRandomRequirement = (requirementType: RequirementType): IQuestRequirements => {
    if(requirementType === "all") return generateAllRequirement()
    else if(requirementType === "balanced") return generatePartyBalanceRequirement()
    else return generateRequirement(getNumberInRange(1, 3, true))
}

/**
 * CHECKME
 * Gets half the number of quests in the db in random order
 * @returns List of quests
 */
 const getQuestsForRequirements = async (): Promise<Quest[]> => {
    const numberOfQuests: number = await Quest.count()
    const quests = await Quest.findAll({
        order: sequelize.fn('RANDOM'),
        limit: numberOfQuests / 2
    });
    return quests;
}

/**
 * Updates a quest requirement
 * @param quest Quest to be updated
 * @param requirement Requirement to be assign
 * @param transaction Transaction
 * @returns Nothing
 */
const updateQuestRequirement = async (quest: Quest, requirement: IQuestRequirements, transaction?: Transaction): Promise<void> => {
    await quest.update({
        requirements: requirement
    }, { transaction: transaction })
}

/**
 * Script that assigns random requirements to random quests
 * @returns Nothing
 */
const executeRequirementGeneration = async (sequelize: Sequelize) => {
    const quests = await getQuestsForRequirements()

    const requirementTypes: RequirementType[] = ["all", "balanced", "character"]
    try {        
        const query = await sequelize.transaction(async t => {
            for(const quest of quests) {
                const requirement = getRandomRequirement(getRandomElement(requirementTypes))
                await updateQuestRequirement(quest, requirement, t)
            }
        })
        console.log("Quests Requirements updated");        
    } catch (error) {
        console.error(error)
    }
}

export default executeRequirementGeneration