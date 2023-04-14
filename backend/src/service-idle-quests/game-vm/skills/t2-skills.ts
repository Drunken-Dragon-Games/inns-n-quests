import { newAPS } from "../character-entity.js"
import { skillTag, classTag, conditionTag, damageTag } from "./helpers.js"
import { Tier1SkillName } from "./t1-skills.js"

const skillsTagT1 = (types?: Tier1SkillName[]): Tier1SkillName[] | undefined => types

export type Tier2SkillName = keyof typeof Tier2Skills

export const Tier2Skills = {
    /** Charisma */
    "Negotion I": skillTag({
        name: "Negotion I",
        description: "Can talk to people, even if they don't want to talk back.",
        benefits: newAPS([0,0.5,0]),
        requires: {
            aps: newAPS([0,5,0]),
            skills: skillsTagT1(["Communication I"]),
        },
    }),
    /** Druid */
    "Invoke Flower Bouquet I": skillTag({
        name: "Invoke Flower Bouquet I",
        description: "Invokes a flower bouquet with no magical properties but of amazing beauty.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,5]),
            classes: classTag(["Druid"]),
            skills: skillsTagT1(["Nature Knowledge I"]),
        },
        provokes: conditionTag(["Entertained"]),
    }),
    "Bark Weapons I": skillTag({
        name: "Bark Weapons I",
        description: "Shapes and transforms branches or tree bark to create daggers that does extra poison damage.",
        benefits: newAPS([1,0.5,0]),
        requires: {
            aps: newAPS([5,3,0]),
            classes: classTag(["Druid"]),
            skills: skillsTagT1(["Slash Weapons I"]),
        },
        damage: damageTag(["Slash", "Nature"]),
        provokes: conditionTag(["Poisoned"]),
    }),
    "Entangling Roots I": skillTag({
        name: "Entangling Roots I",
        description: "Entangles the target in roots, making it unable to move.",
        benefits: newAPS([0,0.5,0]),
        requires: {
            aps: newAPS([0,5,0]),
            classes: ["Druid"],
            skills: skillsTagT1(["Nature Knowledge I"]),
        },
        damage: damageTag(["Nature"]),
        provokes: conditionTag(["Rooted", "Grounded"]),
    }),
    "Minor Shapeshift": skillTag({
        name: "Minor Shapeshift",
        description: "Communes with the spirit of an animal, transforming the caster into a minor beast like a small wolf or tiger.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,5]),
            classes: ["Druid"],
            skills: skillsTagT1(["Mystic Communion I"]),
        },
        damage: damageTag(["Pierce"]),
    }),
}
