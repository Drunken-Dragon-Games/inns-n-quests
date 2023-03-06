import { AdventurerClass, APS, CrafterClass, newAPS, zeroAPS } from "../character-entity";
import { WithTag } from "../iq-entity";
import { QuestRequirement } from "./encounter-requirements";
import { Reward } from "./reward";

export type Quest = {
    questId: string,
    name: string,
    location: string,
    description: string,
    requirements: QuestRequirement,
    timeModifier?: { operator: "multiply" | "add" | "replace", modifier: number },
    rewardModifier?: { operator: "multiply" | "add" | "replace", modifier: Reward },
    slots?: number,
}

export type Encounter = {
    encounterId: string,
    name: string,
    location: string,
    description: string,
    reward: Reward,
    duration: number,
    strategies: Strategy[],
}

export type Strategy = {
    name: string,
    description: string,
    challenges: Challenge[],
    combat?: Combat,
}

export type Challenge = {
    name: string,
    description: string,
    difficulty: number,
    solvedBy: (Condition | SkillName)[]
}

export type Combat = {
    willHitPoints: number,
    magicHitPoints: number,
    physicalHitPoints: number,
    resistances: DamageType[],
    weaknesses: DamageType[],
}

export type DamageType
    = WillDamageType | MagicDamageType | PhysicalDamageType

export type WillDamageType 
    = "Fear" 
    | "Seduction"
    | "Sadness"

export type MagicDamageType
    = "Fire"
    | "Frost"
    | "Shadow"
    | "Nature"
    | "Arcane"

export type PhysicalDamageType
    = "Blunt"
    | "Pierce"
    | "Slash"

export type Condition
    = "Poisoned"
    | "Bleeding"
    | "Stunned"
    | "Blinded"
    | "Silenced"
    | "Disarmed"
    | "Rooted"
    | "Slowed"
    | "Feared"
    | "Confused"
    | "Asleep"
    | "Charmed" 
    | "Aflame"
    | "Frozen"
    | "Electrified"
    | "Cursed"
    | "Grounded"
    | "Entertained"

const damageTag = (types?: DamageType[]): DamageType[] | undefined => types

const conditionTag = (types?: Condition[]): Condition[] | undefined => types

const classTag = (types?: AdventurerClass[] | CrafterClass[]): AdventurerClass[] | CrafterClass[] | undefined => types

const skillsTagT1 = (types?: Tier1SkillName[]): Tier1SkillName[] | undefined => types

export type Tier1SkillName = keyof typeof Tier1Skills

export const Tier1Skills = {
    /** Athleticism */
    "Run I": {
        description: "Runs faster than most people, might trip though.",
        benefits: newAPS([1,0,0]),
        requires: {
            aps: newAPS([1,0,0]),
            class: classTag(),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    "Climb I": {
        description: "Can climb a tree, if it's not too tall.",
        benefits: newAPS([1,0,0]),
        requires: {
            aps: newAPS([1,0,0]),
            class: classTag(),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    /** Intellect */
    "Quick Decisions I": {
        description: "Makes quick decisions... not necessarily good ones.",
        benefits: newAPS([0,1,0]),
        requires: {
            aps: newAPS([0,1,0]),
            class: classTag(),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    "Nature Knowledge I": {
        description: "Know's what is the difference between a fruit and a vegetable.",
        benefits: newAPS([0,1,0]),
        requires: {
            aps: newAPS([0,1,0]),
            class: classTag(),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    /** Charisma */
    "Communication I": {
        description: "Can talk to people, even if they don't want to talk back.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,1]),
            class: classTag(),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    "Mystic Communion I": {
        description: "Can talk with minor spirits, demons and deities, but they don't always listen.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,1]),
            class: classTag(),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    /** Martial Combat */
    "Slash Weapons I": {
        description: "Can slash with a sword or a knife without cutting himself most of the times.",
        benefits: newAPS([1,0,0]),
        requires: {
            aps: newAPS([1,0,0]),
            class: classTag(),
        },
        damage: damageTag(["Slash"]),
        provokes: conditionTag(),
    },
}

export type Tier2SkillName = keyof typeof Tier2Skills

//export type Tier2SkillRecord = Record<Tier2SkillName, SkillInfo<Tier1SkillName>>

export const Tier2Skills = {
    /** Charisma */
    "Negotion I": {
        description: "Can talk to people, even if they don't want to talk back.",
        benefits: newAPS([0,0.5,0]),
        requires: {
            aps: newAPS([0,5,0]),
            classes: classTag(),
            skills: skillsTagT1(["Communication I"]),
        },
        damage: damageTag(),
        provokes: conditionTag(),
    },
    /** Druid */
    "Invoke Flower Bouquet I": {
        description: "Invokes a flower bouquet with no magical properties but of amazing beauty.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,5]),
            classes: classTag(["Druid"]),
            skills: skillsTagT1(["Nature Knowledge I"]),
        },
        damage: damageTag(),
        provokes: conditionTag(["Entertained"]),
    },
    "Bark Weapons I": {
        description: "Shapes and transforms branches or tree bark to create daggers that does extra poison damage.",
        benefits: newAPS([1,0.5,0]),
        requires: {
            aps: newAPS([5,3,0]),
            classes: classTag(["Druid"]),
            skills: skillsTagT1(["Slash Weapons I"]),
        },
        damage: damageTag(["Slash", "Nature"]),
        provokes: conditionTag(["Poisoned"]),
    },
    "Entangling Roots I": {
        description: "Entangles the target in roots, making it unable to move.",
        benefits: newAPS([0,0.5,0]),
        requires: {
            aps: newAPS([0,5,0]),
            classes: ["Druid"],
            skills: skillsTagT1(["Nature Knowledge I"]),
        },
        damage: damageTag(["Nature"]),
        provokes: conditionTag(["Rooted", "Grounded"]),
    },
    "Minor Shapeshift": {
        description: "Communes with the spirit of an animal, transforming the caster into a minor beast like a small wolf or tiger.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,5]),
            classes: ["Druid"],
            skills: skillsTagT1(["Mystic Communion I"]),
        },
        damage: damageTag(["Pierce"]),
        provokes: conditionTag(),
    },
}

export type SkillName = Tier1SkillName | Tier2SkillName

export type SkillInfo = {
    description: string,
    benefits: APS,
    requires: {
        aps: APS,
        classes?: (AdventurerClass | CrafterClass)[],
        skills: SkillName[],
    },
    damage?: DamageType[],
    provokes?: Condition[],
}

const AccSkills = { ...Tier1Skills, ...Tier2Skills }

export const Skills = {

    get(name: SkillName): SkillInfo {
        const res = AccSkills[name] as SkillInfo
        return res
    }
}

export const testEncounter: Encounter & WithTag<"available-encounter"> = {
    ctype: "available-encounter",
    encounterId: "ae991e8c-361f-44e9-afbc-461fb94be2fa",
    name: "Unwanted Feathered Visitors",
    description: "A flock of harpies has been terrorizing Vismeir, close to Auristar, stealing food and causing trouble! The villagers of Vismeir have asked you to help them get rid of the them.",
    location: "Auristar",
    reward: {
        currency: 100,
        items: {},
        experience: zeroAPS,
    },
    duration: 30,
    strategies: [{
        name: "Hunt them down.",
        description: "We can kill them, but they fly.",
        challenges: [{
            name: "Pin them down.",
            description: "We need to figure out how to bring them down to the ground.",
            difficulty: 10,
            solvedBy: ["Grounded"],
        }],
        combat: {
            willHitPoints: 10,
            magicHitPoints: 10,
            physicalHitPoints: 10,
            resistances: ["Nature"],
            weaknesses: ["Pierce"],
        },
    }, {
        name: "Talk to them.",
        description: "We can talk to them, but we need to bring them down without provoking them.",
        challenges: [{
            name: "Peaceful engagement.",
            description: "We need to figure out how to talk to them without provokation.",
            difficulty: 15,
            solvedBy: ["Entertained"],
        }, {
            name: "Negotiation.",
            description: "We need someone to convince them to leave.",
            difficulty: 12,
            solvedBy: ["Negotion I"],
        }]
    }]
}
