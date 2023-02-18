import { APS } from "./aptitude-points-system"

export interface Adventurer {
    ctype: "adventurer",
    adventurerId: string,
    userId: string,
    name: string,
    class: AdventurerClass,
    race: Race,
    collection: AdventurerCollection,
    assetRef: string,
    sprite: string,
    hp: number,
    inChallenge: boolean,
    athleticism: number,
    intellect: number,
    charisma: number,
    athXP: number,
    intXP: number,
    chaXP: number,
    realATH: number,
    realINT: number,
    realCHA: number,
}

export type AdventurerParty = {
    partyId: string,
    adventurers: Adventurer[],
    location: [number, number],
}

export type Race = "human" | "elf" | "tiefling" | "dragonkin" | "worgenkin" | "undead" | "viera" | "troll" | "vulkin" | "orc" | "tauren"

export const races = ["human", "elf", "tiefling", "dragonkin", "worgenkin", "undead", "viera", "troll", "vulkin", "orc", "tauren"]

export type AdventurerClass = "fighter" | "paladin" | "ranger" | "rogue" | "bard" | "mage" | "warlock" | "cleric" | "druid" | "knight"

export const adventurerClasses = ["fighter", "paladin", "ranger", "rogue", "bard", "mage", "warlock", "cleric", "druid", "knight"]

export type AdventurerCollection = "grandmaster-adventurers" | "adventurers-of-thiolden" | "pixel-tiles"

export const adventurerCollections = ["grandmaster-adventurers", "adventurers-of-thiolden", "pixel-tiles"]

export const tagAdventurer = (adventurer: any): any => 
    ({...adventurer, ctype: "adventurer" })

export const adventurerAPS = (adventurer: Adventurer): APS => ({
    athleticism: adventurer.athleticism,
    intellect: adventurer.intellect,
    charisma: adventurer.charisma,
})

export const tagRealAPS = (adventurer: object): object => {
    const { athleticism, intellect, charisma } = realAPS(adventurer as Adventurer)
    return ({...adventurer, realATH: athleticism, realINT: intellect, realCHA: charisma })
}

export const realAPS = (adventurer: Adventurer): APS => ({
    athleticism: levelByXP(adventurer.athXP) - 1 + adventurer.athleticism,
    intellect: levelByXP(adventurer.intXP) - 1 + adventurer.intellect,
    charisma: levelByXP(adventurer.chaXP) - 1 + adventurer.charisma,
})

export type IndividualXPReward = { [ adventurerId: string ]: APS }

export const individualXPReward = (adventurers: Adventurer[], reward: APS): IndividualXPReward => {
    const amount = adventurers.length
    const baseAthXP = Math.ceil(reward.athleticism / amount) 
    const baseIntXP = Math.ceil(reward.intellect / amount)
    const baseChaXP = Math.ceil(reward.charisma / amount)
    const result: IndividualXPReward = {}
    adventurers.forEach(adventurer => {
        const athXP = adventurer.athleticism * baseAthXP / 10
        const intXP = adventurer.intellect * baseIntXP / 10
        const chaXP = adventurer.charisma * baseChaXP / 10
        result[adventurer.adventurerId] = {athleticism: athXP, intellect: intXP, charisma: chaXP}
    })
    return result
}

export const totalXPRequiredForNextLevel = (level: number) =>
    10 * ((level * (level + 1) * (2 * level + 1) / 6) + (10 * (level * (level + 1) / 2)))

export function levelByXP(xp: number): number {
    if (xp === 0) return 1
    const roots = cubicSolver(10/3, 55, 155/3, -xp);
    const realRoots = roots.map(root => {
        return root.real;
    })
    const root = realRoots.find(root => root >= 0)
    return Math.floor(Math.round(root! * 10) / 10 + 1);
}

export function cubicSolver(a: number, b: number, c: number, d: number) {

    b /= a;
    c /= a;
    d /= a;

    var discrim, q, r, dum1, s, t, term1, r13;

    q = (3.0 * c - (b * b)) / 9.0;
    r = -(27.0 * d) + b * (9.0 * c - 2.0 * (b * b));
    r /= 54.0;

    discrim = q * q * q + r * r;

    var roots = [{ real: 0, i: 0 }, { real: 0, i: 0 }, { real: 0, i: 0 }]

    term1 = (b / 3.0);

    if (discrim > 0) { // one root real, two are complex
        s = r + Math.sqrt(discrim);
        s = ((s < 0) ? -Math.pow(-s, (1.0 / 3.0)) : Math.pow(s, (1.0 / 3.0)));
        t = r - Math.sqrt(discrim);
        t = ((t < 0) ? -Math.pow(-t, (1.0 / 3.0)) : Math.pow(t, (1.0 / 3.0)));

        roots[0].real = -term1 + s + t;
        term1 += (s + t) / 2.0;
        roots[1].real = roots[2].real = -term1;
        term1 = Math.sqrt(3.0) * (-t + s) / 2;

        roots[1].i = term1;
        roots[2].i = -term1;
        return roots;
    } // End if (discrim > 0)

    // The remaining options are all real


    if (discrim == 0) { // All roots real, at least two are equal.
        r13 = ((r < 0) ? -Math.pow(-r, (1.0 / 3.0)) : Math.pow(r, (1.0 / 3.0)));
        roots[0].real = -term1 + 2.0 * r13;
        roots[2].real = roots[1].real = -(r13 + term1);
        return roots;
    } // End if (discrim == 0)

    // Only option left is that all roots are real and unequal (to get here, q < 0)
    q = -q;
    dum1 = q * q * q;
    dum1 = Math.acos(r / Math.sqrt(dum1));
    r13 = 2.0 * Math.sqrt(q);

    roots[0].real = -term1 + r13 * Math.cos(dum1 / 3.0);
    roots[1].real = -term1 + r13 * Math.cos((dum1 + 2.0 * Math.PI) / 3.0);
    roots[2].real = -term1 + r13 * Math.cos((dum1 + 4.0 * Math.PI) / 3.0);

    return roots;
}