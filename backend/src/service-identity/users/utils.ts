import { User } from "./users-db";

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const genIdNumber = (): string => {
    const n = getRandomInt(0, 9999)
    if (n < 10) return `000${n}`
    else if (n < 100) return `00${n}`
    else if (n < 1000) return `0${n}`
    else return n.toString()
}

export const generateIdentenfier = async (nickname: string): Promise<string> => {
    let taken: User | null
    let nameIdentifier: string
    do {
        nameIdentifier = genIdNumber()
        taken = await User.findOne({ where: { nickname, nameIdentifier } })
    } while (taken != null)
    return nameIdentifier
}

export const generateRandomNickname = async (): Promise<string> => {
    const adjectives: string[] = [
        "Daring", 
        "Valiant", 
        "Brave", 
        "Funny", 
        "Fancy", 
        "Dancing", 
        "Incredible",
        "Misterious",
        "Enigmatic",
        "Clever", 
        "Magical",
        "Dreathful",
        "Resilent",
        "Merciful"
    ]
    const profesions: string[] = [
        "Alchemist", 
        "Carpenter",
        "Blacksmith", 
        "Cook", 
        "Brewer", 
        "Host",
        "Innkeeper",
        "Lorekeeper",
        "Knight", 
        "Fighter", 
        "Paladin", 
        "Rogue", 
        "Mage", 
        "Warlock", 
        "Ranger", 
        "Necromancer", 
        "Druid", 
        "Cleric", 
        "Bard", 
    ]
    const nickname: string = adjectives[getRandomInt(0, adjectives.length-1)] + profesions[getRandomInt(0, profesions.length-1)]
    return nickname
}
