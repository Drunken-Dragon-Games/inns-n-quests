export * from "./character-entity"
export * from "./default-ruleset"
export * from "./encounter"
export * from "./encounters"
export * from "./furniture-entity"
export * from "./iq-entity"
export * from "./iq-metadata-object-builder"
export { default as IQRandom } from "./iq-random"
export * from "./iq-ruleset"
export * from "./sectors"
export * from "./skills"
export * from "./staking-quest"
export * from "./utils"

import { Character } from "../models"
import { newAPS, zeroAPS } from "./character-entity"
export const testCharacters = (userId: string): Character[] => [{
    ctype: "character",
    entityId: "1e991e8c-361f-44e9-afbc-461fb94be2fa",
    entityType: "character-entity",
    name: "James the Beer Slime",
    assetRef: "PixelTile32",
    userId,
    sprite: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_32.png",
    inActivity: false,
    characterType: {
        ctype: "adventurer",
        class: "Druid"
    },
    collection: "pixel-tiles",
    race: "Slime",
    hp: 1,
    ivAPS: zeroAPS,
    xpAPS: zeroAPS,
    evAPS: newAPS([5, 14, 20]),
    nextLevelXP: newAPS([100,100,100]),
    skills: [
        "Slash Weapons I",
        "Nature Knowledge I",
        "Entangling Roots I"
    ],
}, {
    ctype: "character",
    entityId: "2e991e8c-361f-44e9-afbc-461fb94be2fa",
    entityType: "character-entity",
    name: "Francois the Beer Slime",
    assetRef: "PixelTile32",
    userId,
    sprite: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_32.png",
    inActivity: false,
    characterType: {
        ctype: "adventurer",
        class: "Druid"
    },
    collection: "pixel-tiles",
    race: "Slime",
    hp: 1,
    ivAPS: zeroAPS,
    xpAPS: zeroAPS,
    evAPS: newAPS([5, 10, 20]),
    nextLevelXP: newAPS([100,100,100]),
    skills: [
        "Slash Weapons I",
        "Mystic Communion I",
        "Minor Shapeshift",
    ],
}, {
    ctype: "character",
    entityId: "3e991e8c-361f-44e9-afbc-461fb94be2fa",
    entityType: "character-entity",
    name: "Beerhertz",
    assetRef: "PixelTile32",
    userId,
    sprite: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_32.png",
    inActivity: false,
    characterType: {
        ctype: "adventurer",
        class: "Druid"
    },
    collection: "pixel-tiles",
    race: "Slime",
    hp: 1,
    ivAPS: zeroAPS,
    xpAPS: zeroAPS,
    evAPS: newAPS([5, 10, 20]),
    nextLevelXP: newAPS([100,100,100]),
    skills: [
        "Slash Weapons I",
        "Communication I",
        "Negotion I",
    ],
}, {
    ctype: "character",
    entityId: "4e991e8c-361f-44e9-afbc-461fb94be2fa",
    entityType: "character-entity",
    name: "Beertyr",
    assetRef: "PixelTile32",
    userId,
    sprite: "https://cdn.ddu.gg/pixeltiles/x3/pixel_tile_32.png",
    inActivity: false,
    characterType: {
        ctype: "adventurer",
        class: "Druid"
    },
    collection: "pixel-tiles",
    race: "Slime",
    hp: 1,
    ivAPS: zeroAPS,
    xpAPS: zeroAPS,
    evAPS: newAPS([5, 10, 20]),
    nextLevelXP: newAPS([100,100,100]),
    skills: [
        "Slash Weapons I",
        "Nature Knowledge I",
        "Invoke Flower Bouquet I",
        "Bark Weapons I",
        "Negotion I"
    ],
}]