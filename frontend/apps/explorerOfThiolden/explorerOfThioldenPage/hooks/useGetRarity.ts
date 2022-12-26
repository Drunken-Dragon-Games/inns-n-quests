import { useState, useEffect } from "react"
import adventurersMetadata from "../data/all-adv-info.json"

interface CardArray {
    Adventurer: string
    athleticism: number
    charisma: number
    image: string
    intellect: number
    src: string
    tokenNumber: number
    rarity: string
}

interface adventurersData{
    terrorhertz : adenturers
    vimtyr: adenturers
    aki: adenturers
    othil: adenturers
    tyr: adenturers
    ulf: adenturers
    marendil: adenturers
    haakon: adenturers
    vale: adenturers
    naya: adenturers
    shaden: adenturers
    drignir: adenturers
    gulnim: adenturers
    avva: adenturers
    delthamar: adenturers
    aumara: adenturers
    milnim : adenturers
}


interface adenturers{
    Adventurer: string
    Title: string
    Race: string
    Age: string
    Faction: string
    "Game Class": string
    "Lore Class": string
    "Concept Artists"?: string []
    "Splashart Composition Artists"?: string []
    "Pixel Artists"?: string []
    "Miniature Pixel Artists"?: string []

}


interface rarities {
    factionRarity: factionRarity
    materialRarety: materialRarety
    classRarity: classRarity
}
interface factionRarity{
    advofeast: quantity
    auristar: quantity
    deadqueen: quantity
    drunkendragon: quantity
    jagermyr: quantity
    kullmyr: quantity
    nurmyr: quantity
    vilnay: quantity
}

interface materialRarety {
    bronze: quantity
    diamond: quantity
    drunkendragon: quantity
    gold: quantity
    myrthrill: quantity
    silver: quantity
}

interface classRarity {
    alchemist: quantity 
    bard: quantity
    blacksmith: quantity
    brewer: quantity
    carpenter:quantity
    cleric:quantity 
    cook:quantity
    druid: quantity
    fighter: quantity
    host: quantity
    knight:quantity
    mage: quantity
    paladin: quantity
    ranger: quantity
    rogue: quantity
    trader: quantity
    warlock: quantity
}

interface quantity{
    percentage: number
    total: number
}

export default (arrayData: CardArray[]) : rarities | null => {
    const [rarities, setRarities] = useState<rarities | null>(null)

    useEffect(() => {
        const materialRarity: materialRarety = raritiesOf(arrayData)
        const factionRarity : factionRarity = factionsOf(arrayData)
        const classRarity: classRarity = classOf(arrayData)
        setRarities(({materialRarety: materialRarity, factionRarity: factionRarity, classRarity: classRarity } as rarities))
    }, [arrayData])
    

    const raritiesOf = (generatedAdventurers: CardArray []) => {
        const total = generatedAdventurers.length
        const drunkendragon = generatedAdventurers.filter(data  => data.rarity == "Drunken Dragon").length
        const myrthrill = generatedAdventurers.filter(data => data.rarity == "Myrthrill").length
        const diamond = generatedAdventurers.filter(data => data.rarity == "Diamond").length
        const gold = generatedAdventurers.filter(data => data.rarity == "Gold").length
        const silver = generatedAdventurers.filter(data => data.rarity == "Silver").length
        const bronze = generatedAdventurers.filter(data => data.rarity == "Bronze").length
    
        return {
            "total" : total,
            "bronze" : {
                "total": bronze,
                "percentage": Math.round(bronze * 100 / total)
            },
            "silver" : {
                "total": silver,
                "percentage": Math.round(silver * 100 / total)
            },
            "gold" : {
                "total": gold,
                "percentage": Math.round(gold * 100 / total)
            },
            "diamond" : {
                "total": diamond,
                "percentage": Math.round(diamond * 100 / total)
            },
            "myrthrill" : {
                "total": myrthrill,
                "percentage": Math.round(myrthrill * 100 / total)
            },
            "drunkendragon" : {
                "total": drunkendragon,
                "percentage": Math.round(drunkendragon * 100 / total)
            }
        }
    }
    

    const factionsOf = (generatedAdventurers: CardArray []) => {
        const total = generatedAdventurers.length;

        const vilnay = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Vilnay").length
        const auristar = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Auristar").length
        const kullmyr = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Kullmyr").length
        const jaggermyr = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Jagermyr").length
        const nurmyr = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Nurmyr").length
        const advofeast = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Adventurer of the East").length
        const deadqueen = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "The Dead Queen").length
        const drunkendragon = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)].Faction == "Adventurer of the Drunken Dragon").length
    
        return {
            "total": total,
            "vilnay": {
                "total": vilnay,
                "percentage": Math.round(vilnay * 100 / total)
            },
            "auristar": {
                "total": auristar,
                "percentage": Math.round(auristar * 100 / total)
            },
            "kullmyr": {
                "total": kullmyr,
                "percentage": Math.round(kullmyr * 100 / total)
            },
            "jagermyr": {
                "total": jaggermyr,
                "percentage": Math.round(jaggermyr * 100 / total)
            },
            "nurmyr": {
                "total": nurmyr,
                "percentage": Math.round(nurmyr * 100 / total)
            },
            "advofeast": {
                "total": advofeast,
                "percentage": Math.round(advofeast * 100 / total)
            },
            "deadqueen": {
                "total": deadqueen,
                "percentage": Math.round(deadqueen * 100 / total)
            },
            "drunkendragon":{
                "total": drunkendragon,
                "percentage": Math.round(drunkendragon * 100 / total)
            },
        }
    }

    const classOf = (generatedAdventurers: CardArray []) => {
        const total = generatedAdventurers.length;

        const alchemist = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Alchemist").length
        const bard = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Bard").length
        const blacksmith = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Blacksmith").length
        const brewer = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Brewer").length
        const carpenter = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Carpenter").length
        const cleric = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Cleric").length
        const cook = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Cook").length
        const druid = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Druid").length
        const fighter = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Fighter").length
        const host = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Host").length
        const knight = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Knight").length
        const mage = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Mage").length
        const paladin = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Paladin").length
        const ranger = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Ranger").length
        const rogue = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Rogue").length
        const trader = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Trader").length
        const warlock = generatedAdventurers.filter(adventurer => adventurersMetadata[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == "Warlock").length
    
    
        return {
            "total": total,
            "alchemist": {
                "total": alchemist,
                "percentage": Math.round(alchemist * 100 / total)
            },
            "bard": {
                "total": bard,
                "percentage": Math.round(bard * 100 / total)
            },
            "blacksmith": {
                "total": blacksmith,
                "percentage": Math.round(blacksmith * 100 / total)
            },
            "brewer": {
                "total": brewer,
                "percentage": Math.round(brewer * 100 / total)
            },
            "carpenter": {
                "total": carpenter,
                "percentage": Math.round(carpenter * 100 / total)
            },
            "cleric": {
                "total": cleric,
                "percentage": Math.round(cleric * 100 / total)
            },
            "cook": {
                "total": cook,
                "percentage": Math.round(cook * 100 / total)
            },
            "druid":{
                "total": druid,
                "percentage": Math.round(druid * 100 / total)
            },
            "fighter": {
                "total": fighter,
                "percentage": Math.round(fighter * 100 / total)
            },
            "host": {
                "total": host,
                "percentage": Math.round(host * 100 / total)
            },
            "knight": {
                "total": knight,
                "percentage": Math.round(knight * 100 / total)
            },
            "mage": {
                "total": mage,
                "percentage": Math.round(mage * 100 / total)
            },
            "paladin": {
                "total": paladin,
                "percentage": Math.round(paladin * 100 / total)
            },
            "ranger": {
                "total": ranger,
                "percentage": Math.round(ranger * 100 / total)
            },
            "rogue": {
                "total": rogue,
                "percentage": Math.round(rogue * 100 / total)
            },
            "trader":{
                "total": trader,
                "percentage": Math.round(trader * 100 / total)
            },
            "warlock":{
                "total": warlock,
                "percentage": Math.round(warlock * 100 / total)
            },
        }
    }


    
    return rarities
}