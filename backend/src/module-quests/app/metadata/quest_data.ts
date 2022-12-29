import { IMonsterData, IRarity, IRewards, INarrative } from "../types"

const NARRATIVES: INarrative[] = [
    {
        "name": "MISSING TOWNFOLK", 
        "description": "Kind adventurers wanted. Our villagers have been disappearing! To the <location> we have identified <monster>. It must be related! Our nijmkjold is lacking personel. Neighbours have cooperated with a <reward-type> reward of <reward-amount> Dragon Silver.",
        "rarity": "townsfolk",
        "monster": "minor_beasts"

    },
    {
        "name": "GREAT BEAST LOCATED!",
        "description": "Glory awaits! Our vilnay town has spotted <monster> to the <location>. Valiant adventurers who strive for fame and a <reward-type> reward of <reward-amount> Dragon Silver should return to the town hall with proof of the kill if you are so skilful to survive.",
        "rarity": "valiant_adventure",
        "monster": "major_beasts"

    },
    {
        "name": "MENACE TO ALL VILNAY",
        "description": "Vilnay unite! While Auristarnay sleep tight behind their walls, our sons and daughters are at risk! A scout gave his life to locate <monster> to the <location>. All adventurers who join us in fighting against this threat shall be rewarded with a <reward-type> amount of <reward-amount> Dragon Silver!",
        "rarity": "heroic_quest",
        "monster": "civilization_menace"

    },
    {
        "name": "THE ILLINAY'JEGGERDEN",
        "description": "Vilnayanay, Auristarnay and Kullmyrnay! Warriors, mages and clerics! Foreign adventurers and local adventurers! Heed the call of an ancient Thioldanay tradition. The Great Hunt that forges heroes and legends will start to the <location> for <monster> has been sighted. The Illinay'jeggerden is an ancient tradition where the strongest and bravest face a legendary creature to pass into the history of Thiolden as a great hero. Songs shall be sung! Tales shall be written! All to those who hunt this ancient creature and come out bathed in blood and glory! Those who survive will receive a <reward-type> prize of <reward-amount> Dragon Silver, complementary to the fortune of prevailing in such a mythical event.",
        "rarity": "kings_plea",
        "monster": "ancient_beasts",

    },
    {
        "name": "SPRITES, CUTE BUT ANNOYING!",
        "description": "Farmers and miners have reported property damage made by <monster>. Therefore, help is needed to deal with the infestation. Your adventuring party can find them at the <location>. The local farmers and miners promise a <reward-type> compensation of <reward-amount> Dragon Silver.",
        "rarity": "townsfolk",
        "monster": "minor_elementals",

    },
    {
        "name": "SPRITES, LET'S LEAVE THEM ALONE NEXT TIME",
        "description": "Local adventurers have killed elemental sprites to save property from whiny baby farmers and miners... now nature rages over our town! We seek adventurers that will deal with the situation properly this time... Destroy the <monster> that rages over at the <location>! We will pay a <reward-type> salary of <reward-amount> Dragon Silver.",
        "rarity": "valiant_adventure",
        "monster": "major_elementals",

    },
    {
        "name": "THIOLDEN'S WRATH RAGES",
        "description": "Adventurers of Thiolden! Thiolden's nature rages over us! At the <location> <monster> has taken form. Those who end this abomination shall be rewarded with a <reward-type> amount of <reward-amount> pieces of Dragon Silver, claimable at the Adventurer's Great Hall at Auristar's highest city ring.",
        "rarity": "heroic_quest",
        "monster": "wrath_manifestation",

    },
    {
        "name": "A LEGENDARY ELEMENTAL MANIFESTATION",
        "description": "Beware! For <monster> has manifested at the <location>. This unexpected visitor is infrequent, and the ancient scriptures only foresee calamity coming from such an event. The king himself requests the best adventurers to be sent to repeal this threat. In exchange, the city-state and kingdom of Auristar promise a <reward-type> chest with <reward-amount> pieces of Dragon Silver.",
        "rarity": "kings_plea",
        "monster": "elemental_primes",

    },
]

const RARITES: IRarity[] = [
    {
        "name": "kings_plea",
        "percentage": .01,
        "monsters": {
            "beasts": "ancient_beasts",
            "elementals": "elemental_primes"
        },
        "xp_base_modifier": 10,
        "max_level_required": 100,
        "min_level_required": 50,
        "max_duration": 1296000000,
        "min_duration": 864000000,  
    },
    {
        "name": "heroic_quest",
        "percentage": .05,
        "monsters": {
            "beasts": "civilization_menace",
            "elementals": "wrath_manifestation"
        },
        "xp_base_modifier": 5,
        "max_level_required": 80,
        "min_level_required": 30,
        "max_duration": 777600000,
        "min_duration": 345600000,  
    },
    {
        "name": "valiant_adventure",
        "percentage": .2,
        "monsters": {
            "beasts": "major_beasts",
            "elementals": "major_elementals"       
        },
        "xp_base_modifier": 2,
        "max_level_required": 60,
        "min_level_required": 10,
        "max_duration": 432000000,
        "min_duration": 172800000,  
    },
    {
        "name": "townsfolk",
        "percentage": 1,
        "monsters": {
            "beasts": "minor_beasts",
            "elementals": "minor_elementals"        
        },
        "xp_base_modifier": 1,
        "max_level_required": 40,
        "min_level_required": 1,
        "max_duration": 259200000,
        "min_duration": 86400000,  
    }
]

const MONSTERS: IMonsterData = {
    "beasts": {
        "minor_beasts": [
            "a pack of Dire Wolves",
            "a young Hippogryph",
            "a clan of wild Beastmen",
            "a cauldron of Direbats",
            "a colony of Black Spiders"
        ],
        "major_beasts": [
            "a formidable Ettin",
            "a pack of rabid Worgs",
            "lurking Great Spiders",
            "a fully grown Hippogryph"
        ],
        "civilization_menace": [
            " a wild Drake of the north",
            "an invading wild-beastmen force and their chieftain",
            "an impressively bright Magi Ettin"
        ],
        "ancient_beasts": [
            "a timeless Dragon",
            "an enraged Worg demi-god",
            "an ancient Brood-mother"
        ],
        "places": [
            "west of Vis, in the dark forest of Kilingard",
            "north of Farvirheim, across the river and near the great ruins",
            "south of Westmyr, at the forgotten forest of Fernavireyn"
        ]
    },
    "elementals": {
        "minor_elementals": [
            "cosmic Worms, spawns from the water of the Auristar",
            "uphill volcanic Sprites",
            "playful and anoying river Sprites",
            "uncommon and problematic Livingwinds",
            "rock Sprites",
            "ice Shardlings from the frozen peaks"
        ],
        "major_elementals": [
            "molten Volcanic Golem",
            "raging River Golem",
            "lost Cosmic Golem",
            "destructive Storm Elemental",
            "uncommon Mountain Golem"
        ],
        "wrath_manifestation": [
            "a terrifying  Magma Drake",
            "a remarkably rare Ice-made Drake",
            "an elemental Fire Wrath",
            "an elemental Water Wrath",
            "an elemental Earth Wrath",
            "an elemental Thunder Wrath",
            "an Auristar's Manifestation, a creature made of pure cosmic force from the waters of the Auristar"
        ],
        "elemental_primes": [
            "a legendary Dreimar Dreikyr (Volcano-made Dragon)",
            "a legendary Kinwyrmar Dreikyr (Ice-made Dragon)",
            "a visitor and monumental menace from the elemental planes, a Fireplane Baron",
            "a visitor and monumental menace from the elemental planes, an Oceanplane Noble",
            "a visitor and monumental menace from the elemental planes, a Skyplane Lord",
            "a visitor and monumental menace from the elemental planes, an Underground Sovereign"
        ],
        "places": [
            "northern mountains of Talin's Rest",
            "western caverns of Auristar, the cosmic caves known as the Starifjolden",
            "north of Karhak'Modan, at the heights of Lysmar Peak"
        ]
    }
}

const REWARDS: IRewards[] = [
    {
        "name": "desperate",
        "probability": .05,
        "min_reward": 1.9,
        "max_reward": 2.1
    },
    {
        "name": "generous",
        "probability": 0.1,
        "min_reward": 1.6,
        "max_reward": 1.8
    },
    {
        "name": "just",
        "probability": 0.2,
        "min_reward": 1.3,
        "max_reward": 1.5
    },
    {
        "name": "modest",
        "probability": 1,
        "min_reward": 1,
        "max_reward": 1.2
    }
]

export {
    MONSTERS,
    NARRATIVES,
    RARITES,
    REWARDS
}