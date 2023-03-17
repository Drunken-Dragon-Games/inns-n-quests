import { AvailableStakingQuest, Character, Furniture, SealType, TakenStakingQuest, Units, vh, vh1, vw, vw1 } from "../../common"

export type SelectedQuest = AvailableStakingQuest | TakenStakingQuest 

export type InventoryPageName = "characters" | "taken-quests" | "furniture"

export type InventoryAsset = Character | Furniture

export type InventoryItem = Character | TakenStakingQuest | Furniture

export type ActivitySelection = SelectedQuest | Character | Furniture | { ctype: "overworld-dropbox" }

export type CharacterParty = (Character | null)[]

export const mapSealImage = (quest: SelectedQuest, isMobile: boolean): { src: string, width: number, height: number, offset: number, units: Units } => {
    switch (questSeal(quest)) {
        case "heroic-quest": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/heroic_quest_big.png",
            width: 6, height: 9, offset: 2, units: isMobile ? vw(3) : vh(1.8)
        }
        case "kings-plea": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/kings_plea_big.png",
            width: 9, height: 9.5, offset: isMobile ? 0 : 2, units: isMobile ? vw(3) : vh(1.8)
        }
        case "valiant-adventure": return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/valiant_adventure_big.png",
            width: 6, height: 6, offset: 0, units: isMobile ? vw(3) : vh(1.8)
        }
        default: return {
            src: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/seals/townsfolk_big.png",
            width: 8, height: 3, offset: 2, units: isMobile ? vw(3) : vh(1.8)
        }
    }
}

export const activityId = (activity?: ActivitySelection): string =>
    activity?.ctype === "character" ? activity.entityId :
    activity?.ctype === "taken-staking-quest" ? activity.takenQuestId :
    activity?.ctype === "furniture" ? activity.entityId :
    "no-activity"

export const takenQuestId = (quest?: SelectedQuest): string =>
    quest?.ctype === "taken-staking-quest" ? quest.takenQuestId : ""

export const questId = (quest: SelectedQuest): string =>
    quest.ctype === "taken-staking-quest" ? quest.availableQuest.questId : quest.questId

export const questName = (quest: SelectedQuest): string =>
    quest.ctype === "taken-staking-quest" ? quest.availableQuest.name : quest.name

export const questDescription = (quest: SelectedQuest): string =>
    quest.ctype === "taken-staking-quest" ? quest.availableQuest.description : quest.description

//export const questPaper = (quest: SelectedQuest): number =>
    //0
    //quest.ctype === "taken-staking-quest" ? quest.availableQuest.paper : quest.paper

export const questSeal = (quest: SelectedQuest): SealType =>
    quest.ctype === "taken-staking-quest" || quest.ctype === "available-staking-quest" ? "kings-plea" :
    "townsfolk"
    //quest.ctype === "taken-staking-quest" ? quest.availableQuest.seal : quest.seal

export function inventoryItemId(item: InventoryItem): string {
    if (item.ctype === "character")
        return item.entityId
    else if (item.ctype === "furniture")
        return item.entityId
    else //if (item.ctype === "taken-staking-quest")
        return item.takenQuestId
}

export const mapQuestScroll = (takenQuest: TakenStakingQuest) => {
    const seal = questSeal(takenQuest).replace("-", "_")
    return `https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/${seal}.png`
    /*
    switch (takenQuest.availableQuest.seal) {
        case "kings-plea": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/kings_plea.png"
        case "heroic-quest": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/heroic_quest.png"
        case "valiant-adventure": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/valiant_adventure.png"
        case "townsfolk": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/townsfolk.png"
        default: return ""
    }
    */
}

export const sortCharacters = (adventurers: Character[]) => {
    return adventurers.sort((a, b) => {
        if(a.inActivity && !b.inActivity){
            return 1
        }
        if(!a.inActivity && b.inActivity){
            return -1
        }
        return 0
    })
}
