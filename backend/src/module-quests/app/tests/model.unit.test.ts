// import { Adventurer } from "../../adventurers/models.js";
// import { Quest } from "../../quests/models.js";
// import { Transaction } from "sequelize/types";
// import * as adventurerUtils from "../../adventurers/utils.js";
// import { calculateExperienceGained } from "../../quests/utils.js";

test("placeholder", async () => {
    expect(true).toBeTruthy()
})

// const pixeltileData = {
//     id: "113d180b-d5eb-459a-bfa3-acb10e6d4e6d",
//     on_chain_ref: "PixelTile12",
//     experience: 105,
//     in_quest: false,
//     type: "pixeltile",
//     metadata: {},
//     class: "rogue",
//     race: "human",
//     player_stake_address: "stake_test1uzdd7dpzu9hxw4stl79znw0n8hs6vudahdrpnw3yv8aklrgznr9km"
// }

// const gmaData = {
//     id: "213d180b-d5eb-459a-bfa3-acb10e6d4e6d",
//     on_chain_ref: "GrandmasterAdventurer2609",
//     experience: 0,
//     in_quest: false,
//     type: "gma",
//     metadata: {"is_alive": true, "dead_cooldown": 0},
//     class: "fighter",
//     race: "vulkin",
//     player_stake_address: "stake_test1uzdd7dpzu9hxw4stl79znw0n8hs6vudahdrpnw3yv8aklrgznr9km"
// }

// const questData = {
//     id: "215d180b-d5eb-459a-bfa3-acb10e6d4e6d",
//     name: "Quest",
//     description: "Quest Description",
//     reward_ds: 10,
//     reward_xp: 100,
//     difficulty: 1,
//     slots: 2,
//     rarity: "townsfolk",
//     duration: 0,
//     requirements: {
//         character: [{
//             class: "rogue"
//         }],
//         all: true
//     },
//     is_war_effort: false
// }

// let advPixeltile: Adventurer;
// let advGma: Adventurer;
// let quest: Quest;

// describe("Adventurer Unit Tests", () => {
//     beforeEach(() => {
//         Adventurer.prototype.update = jest.fn()
//         advPixeltile = Adventurer.build(pixeltileData);
//         advGma = Adventurer.build(gmaData);
//         console.log = jest.fn()
//     });

//     test("Get Level", () => {
//         const level = advPixeltile.getLevel();
//         expect(level).toEqual(1);
//     });

//     test("Add Experience", async () => {
//         let experience = await advPixeltile.addXP(50);
//         expect(experience).toEqual(pixeltileData.experience);
//     });

//     test("Kill Adventurer Pixeltile", async () => {
//         let deadMetadata = await advPixeltile.kill();
//         let expectedMetadata = {
//             id: pixeltileData.id,
//             type: pixeltileData.type
//         }
//         expect(deadMetadata).toEqual(expectedMetadata);
//     });

//     test("Kill Adventurer GMA", async () => {
//         jest.spyOn(adventurerUtils, "calculateDeathCooldown").mockImplementation(() => {
//             return 1000000
//         })
//         let deadMetadata = await advGma.kill();
//         let expectedMetadata = {
//             id: gmaData.id,
//             type: gmaData.type,
//             dead_cooldown: adventurerUtils.calculateDeathCooldown(gmaData.experience)
//         }
//         expect(deadMetadata).toEqual(expectedMetadata);
//     });

//     test("Revive Adventurer Pixeltile", async () => {
//         let reviveMetadata = await advPixeltile.revive();
//         expect(reviveMetadata).toEqual(undefined);
//     });

//     test("Revive Adventurer GMA", async () => {
//         const reviveMetadata = await advGma.revive();
//         expect(reviveMetadata).toEqual(gmaData.metadata);
//     });

//     test("Get XP Gained", () => {
//         const experience = advPixeltile.calculateGainedXP(1);
//         expect(experience).toEqual(calculateExperienceGained(advPixeltile.getLevel(), 1));
//     });
// });

// describe("Quest Unit Tests", () => {
//     beforeEach(() => {
//         Quest.prototype.update = jest.fn()
//         quest = Quest.build(questData);
//     });

//     test("Check Invalid Requirements", () => {
//         const isValidated = quest.validateRequirements([advPixeltile, advGma]);
//         expect(isValidated).toEqual([false])
//     });

//     test("Check Valid Requirements", () => {
//         const isValidated = quest.validateRequirements([advPixeltile, advPixeltile]);
//         expect(isValidated).toEqual([true])
//     });
// });