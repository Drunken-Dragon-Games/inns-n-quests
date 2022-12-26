type rolls = {[name:string] : string}

export const rolls: rolls = {
    townsfolk:"https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/townsfolk.png",
    valiant_adventure: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/valiant_adventure.png",
    kings_plea:"https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/kings_plea.png",
    heroic_quest: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/scrolls/heroic_quest.png"
}

type stamps = {[name:string] : string}

export const stamps : stamps = {
    succeeded: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/claim_reward.png",
    failed: "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/failed.png",
}

interface array {
    width: number []
    height: number []
}

type propPosition = {[name:number] : array}


export const propPosition: propPosition = {
    1: {
        width: [0, 25],
        height: [1, 15]
        },
    2: {
        width: [0, 35],
        height: [20, 40]
        },
    3: {
        width: [30, 60],
        height: [1, 16]
        },
    4: {
        width: [30, 60],
        height: [15, 30]
        },
}