import { newAPS } from "../character-entity/index.js"
import { skillTag, damageTag } from "./helpers.js"

export type Tier1SkillName = keyof typeof Tier1Skills

export const Tier1Skills = {
    /** Athleticism */
    "Run I": skillTag({
        name: "Run I",
        description: "Runs faster than most people, might trip though.",
        benefits: newAPS([1,0,0]),
        requires: {
            aps: newAPS([1,0,0]),
        },
    }),
    "Climb I": skillTag({
        name: "Climb I",
        description: "Can climb a tree, if it's not too tall.",
        benefits: newAPS([1,0,0]),
        requires: {
            aps: newAPS([1,0,0]),
        },
    }),
    /** Intellect */
    "Quick Decisions I": skillTag({
        name: "Quick Decisions I",
        description: "Makes quick decisions... not necessarily good ones.",
        benefits: newAPS([0,1,0]),
        requires: {
            aps: newAPS([0,1,0]),
        },
    }),
    "Nature Knowledge I": skillTag({
        name: "Nature Knowledge I",
        description: "Know's what is the difference between a fruit and a vegetable.",
        benefits: newAPS([0,1,0]),
        requires: {
            aps: newAPS([0,1,0]),
        },
    }),
    /** Charisma */
    "Communication I": skillTag({
        name: "Communication I",
        description: "Can talk to people, even if they don't want to talk back.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,1]),
        },
    }),
    "Mystic Communion I": skillTag({
        name: "Mystic Communion I",
        description: "Can talk with minor spirits, demons and deities, but they don't always listen.",
        benefits: newAPS([0,0,1]),
        requires: {
            aps: newAPS([0,0,1]),
        },
    }),
    /** Martial Combat */
    "Slash Weapons I": skillTag({
        name: "Slash Weapons I",
        description: "Can slash with a sword or a knife without cutting himself most of the times.",
        benefits: newAPS([1,0,0]),
        requires: {
            aps: newAPS([1,0,0]),
        },
        damage: damageTag(["Slash"]),
    }),
}
