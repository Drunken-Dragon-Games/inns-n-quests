import { zeroAPS } from "../character-entity.js";
import { Encounter } from "../encounter/encounter.js";
import { WithTag } from "../iq-entity.js";

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
            willHitPoints: 20,
            magicHitPoints: 50,
            physicalHitPoints: 30,
            resistances: ["Nature"],
            weaknesses: ["Pierce"],
        },
    }, {
        name: "Talk to them.",
        description: "We can talk to them, but we need to engage without provoking them.",
        challenges: [{
            name: "Peaceful engagement.",
            description: "We need to figure out how to talk to them without provokation.",
            difficulty: 15,
            solvedBy: ["Entertained"],
        }, {
            name: "Negotiation.",
            description: "We need someone to convince them to leave.",
            difficulty: 25,
            solvedBy: ["Negotion I"],
        }]
    }]
}
