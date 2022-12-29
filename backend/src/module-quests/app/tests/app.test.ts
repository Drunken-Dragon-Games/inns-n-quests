// const supertest = require("supertest");
// const {app, sequelize} = require("../app")
// const crypto = require("crypto")
// //import server from "../server";
// import { Server } from "http"
// import jwt from "jsonwebtoken";
// import { SECRET_KEY } from "../settings"
// import { Player } from "../../players/models";
// import { Adventurer } from "../../adventurers/models";
// import { Quest, TakenQuest } from "../../quests/models";
// import SyncAssets from "../../adventurers/sync_assets"
// import { identityServiceClient } from "../../microservices/identity-service-initializer";
// import { CreateNonceResponse, 
//          AuthenticationResponse, 
//          Credentials,
//          ResolveUserResponse } from "@dde/identity-service/dist";
// import * as faucet from "../../players/faucet";
// import { assetManagementServiceClient } from "../../microservices/asset-manager-initializer";
// import { SubmitClaimSignatureResponse, GrantResponse, ListResponse, Inventory } from "@dde/asset-management-service/dist";
// import { registry } from "../utils"
// import  * as randomNft from "../../players/app-logic/testnet/random-nft"

// //////////////////// SET UP DATA ///////////////////////

// let server: Server

// /*
// DECLARES ALL THE VARIABLES THAT THE SET UP FUNCTION NEEDS
// */
// const api = supertest(app);
// const stakeAddress = "stake_test1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4k"
// const invalidSignature = "84584da30127045820955f3f5ac6276d2229d46acb802ca7d3642b5ebbd309589138af7fc9239e161e6761646472657373581de09adf3422e16e67560bff8a29b9f33de1a671bdbb4619ba2461fb6f8da166686173686564f4582836666138376237623436393663396665613535333434383032633666396534343631643631323839584070066588ec279c7da4bcb3fcefa932ceac8fa23b8ca6bb669972f800f45fb39a374d372f7132678b666a9b42ca476d94443f0de90e0b02e51ce289558e0f9a05"
// const validSignature = "84582aa201276761646472657373581de05734973c224274e4d299cbf528d4ab9f434f390553078c786d4140eba166686173686564f45461616161616262626262636363636364646464645840a801473aaea6c52fac20ecd924f696c64f5ff5fc1317d8ffb3cb1f3e5575c2c972c5c52b41c93f4bee94e36ca419e51620a86a73f8cbda38f214a435c8b1b70d"
// const validSignatureKey = "a4010103272006215820dd27ba887571050b9a320a202c59dfd4e9e5560e079638387cd91324ce046be1"
// const tokenData = {
//   userId: "alonsobear",
//   expiration: Date.now() + 100000
// };
// const tokenDataToExpire = {
//   userId: "alonsobear",
//   expiration: 1000
// };
// const invalidTokenData = {
//   userId: "alonsobear",
//   expiration: Date.now() + 100000
// };
// // const notRegisteredAddressTokenData = {
// //   user: "alonsobear",
// //   expiration: Date.now() + 100000
// // };
// const token = jwt.sign(tokenData, SECRET_KEY);
// const tokenToExpire = jwt.sign(tokenDataToExpire, SECRET_KEY);
// const invalidToken = jwt.sign(invalidTokenData, SECRET_KEY);
// // const tokenWithNotRegisterAddress = jwt.sign(notRegisteredAddressTokenData, SECRET_KEY);

// const QUESTS = [
//   {
//     name: "Quest 1",
//     description: "Description quest 1",
//     reward_ds: 10,
//     reward_xp: 1,
//     difficulty: 1,
//     slots: 1,
//     rarity: "townsfolk",
//     duration: 0
//   },
//   {
//     name: "Quest 2",
//     description: "Description quest 2",
//     reward_ds: 10,
//     reward_xp: 1,
//     difficulty: 1,
//     slots: 1,
//     rarity: "townsfolk",
//     duration: 0
//   },
//   {
//     name: "Quest 3",
//     description: "Description quest 3",
//     reward_ds: 10,
//     reward_xp: 1,
//     difficulty: 1,
//     slots: 1,
//     rarity: "townsfolk",
//     duration: 0
//   },
//   {
//     name: "Quest 4",
//     description: "Description quest 4",
//     reward_ds: 10,
//     reward_xp: 1,
//     difficulty: 1,
//     slots: 1,
//     rarity: "townsfolk",
//     duration: 0
//   },
//   {
//     name: "Quest 5",
//     description: "Description quest 4",
//     reward_ds: 10,
//     reward_xp: 1,
//     difficulty: 10,
//     slots: 1,
//     rarity: "townsfolk",
//     duration: 0
//   },

// ]

// //////////////////// SET UP ///////////////////////
// /*
// RESETS DATABASE
// CREATES TEST QUESTS
// CREATES PLAYER
// IMPLEMENTS MOCKING
// */
// beforeAll(async () => {
//   server = app.listen(0, () => console.log(`Server running...`))
//   await sequelize.sync({ force: true });
//   await Quest.bulkCreate(QUESTS);
//   await Player.create({ user_id: "alonsobear" });
// });

// afterAll(async () => {
//   await server.close();
//   await sequelize.close();
// })

// beforeEach(async () => {
//  //////////////////// MOCK IMPLEMENTATIONS ///////////////////////
//  jest.spyOn(SyncAssets.prototype, "requestCurrentNFT").mockImplementation(() => {
//   let nftData = {
//     pixeltiles: [
//       { name: 'PixelTile1', quantity: 1 },
//       { name: 'PixelTile11', quantity: 1 },
//       { name: 'PixelTile12', quantity: 1 }
//     ],
//     gmas: [
//       { name: 'GrandmasterAdventurer8681', quantity: 1 },
//       { name: 'GrandmasterAdventurer2609', quantity: 1 }
//     ],
//     adv_of_thiolden: [
//       { name: 'AdventurerOfThiolden4812', quantity: 1 }
//     ],
//     emojis: []
//   }
//   return Promise.resolve(nftData)
// })

// identityServiceClient.resolveUser = jest.fn(async (): Promise<ResolveUserResponse> => {
//   return {
//     status: "ok",
//     info: {
//       userId: "alonsobear", 
//       nickname: "aBear", 
//       knownStakeAddresses: ["stake_test1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4k"]
//     }
//   }
// })

// identityServiceClient.createSigNonce = jest.fn(async (address: string): Promise<CreateNonceResponse> => {
//   return {
//     status: "ok",
//     nonce: "aaaaabbbbbcccccddddd"
//   }
// })

// assetManagementServiceClient.submitClaimSignature = jest.fn(async (): Promise<SubmitClaimSignatureResponse> => {
//   return {
//     status: "ok",
//     txId: "hello"
//   }
// })

// assetManagementServiceClient.grant = jest.fn(async (): Promise<GrantResponse> => {
//   return {
//     status: "ok"
//   }
// })

// jest.spyOn(faucet, "createMintNftTx").mockImplementation(async () => "examle_tx")
// jest.spyOn(faucet, "signMintTx").mockImplementation(async () => "examle_tx_submited")
// jest.spyOn(randomNft, "getCollectionPolicy").mockImplementation(async (): Promise<string> => {
//   return "someString"
// })

// registry.policies = {
//   pixeltiless: "pixeltiles",
//   gmas: "gmas",
//   aots: "aots",
//   ds: "ds"
// }

// console.log = jest.fn()
// console.error = jest.fn()
// })

// //////////////////// TESTS ///////////////////////
// /*************** Player tests ***************/
// describe("Player Tests", () => {
//   test("validate nonce with non string value", async() => {
//     await api.post("/quests/api/validate")
//     .send({ stakeAddress: 1 })
//     .expect(400);
//   })

//   test('validate nonce', async () => {
//     identityServiceClient.authenticate = jest.fn(async (credentials: Credentials): Promise<AuthenticationResponse> => {
//       return {
//         status: "bad-credentials"
//       }
//     })
//     let response = await api.post("/quests/api/validate")
//     .send({ stakeAddress: stakeAddress })
//     .expect(201);
//     expect(response.body.code).toEqual("instance_created");
//     expect(response.body.nonce.length).toEqual(20);

//     const nonce = response.body.nonce;

//     response = await api.post(`/quests/api/validate/${nonce}`)
//     .send({ signature: invalidSignature,
//             key: validSignatureKey
//           })
//     .expect(401)    
//     expect(response.body.code).toEqual("bad_credentials")
//   });

//   test("validate nonce value", async () => {
//     jest.spyOn(crypto, 'randomBytes').mockImplementation((format) => Buffer.from("aaaaabbbbbcccccddddd", "hex"));
//     let response = await api.post("/quests/api/validate")
//     .send({ stakeAddress: stakeAddress })
//     .expect(201);
//     expect(response.body.nonce).toEqual("aaaaabbbbbcccccddddd")
//   });

//   test("verify valid signature", async () => {
//     jest.spyOn(crypto, 'randomBytes').mockImplementation((format) => Buffer.from("aaaaabbbbbcccccddddd", "hex"));
//     identityServiceClient.authenticate = jest.fn(async (credentials: Credentials): Promise<AuthenticationResponse> => {
//       return {
//         status: "ok",
//         tokens: {
//           session: {
//             userId: "aBear",
//             sessionId: "123456789",
//             authType: "Sig",
//             expiration: 5
//           },
//           refreshToken: "refreshToken"
//         }
//       }
//     })
//     let response = await api.post("/quests/api/validate")
//     .send({ stakeAddress: stakeAddress })
//     .expect(201);

//     const nonce = response.body.nonce;
//     response = await api.post(`/quests/api/validate/${nonce}`)
//     .send({ signature: validSignature,
//             key: validSignatureKey
//     })
//     .expect(201)
//     expect(response.headers["set-cookie"][0]).toContain("access")
//   });

//   test("verify non string signature", async () => {
//     const response = await api.post("/quests/api/validate/asdfghj")
//     .send({ signature: 732849507 })
//     .expect(400);
//     expect(response.body.code).toEqual("invalid_data");
//   });

//   test("verify signature without instance", async () => {
//     identityServiceClient.authenticate = jest.fn(async (credentials: Credentials): Promise<AuthenticationResponse> => {
//       return {
//         status: "bad-credentials"
//       }
//     })    
//     const response = await api.post("/quests/api/validate/aaaafsabbbbbcccccdddddd")
//     .send({ signature: validSignature,
//             key: validSignatureKey
//             })
//     .expect(401);
//     expect(response.body.code).toEqual("bad_credentials");
//   });

//   test('dragon silver without token', async () => {
//     const response = await api.get("/quests/api/vm/dragon-silver")
//     .expect(401);
//     expect(response.body.code).toEqual("invalid_token");
//   });

//   test('dragon silver with token', async () => {
//     assetManagementServiceClient.list = jest.fn(async (userId: string, logger, options?: {
//       count?: number;
//       page?: number;
//       chain?: boolean;
//       policies?: string[];
//   }): Promise<ListResponse> => {
//       let inventory: object = new Object();
//       (inventory as Inventory)[options?.policies![0]!] = [{
//         unit: "DragonSilver",
//         quantity: "100",
//         chain: false
//       }]
//       return {
//         status: "ok",
//         inventory: inventory as Inventory
//       }
//     })
//     const response = await api.get("/quests/api/vm/dragon-silver")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);
//     expect(typeof response.body.dragon_silver).toEqual("number");
//   });

//   test('dragon silver with invalid token', async () => {
//     identityServiceClient.resolveUser = jest.fn(async (): Promise<ResolveUserResponse> => {
//       return {
//         status: "ok",
//         info: {
//           userId: "alonsobear", 
//           nickname: "aBear", 
//           knownStakeAddresses: ["stake_test1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4l"]
//         }
//       }
//     })
//     const response = await api.get("/quests/api/vm/dragon-silver")
//     .set({"Cookie": `access=${token}`})
//     .expect(200)
//   });

//   test('logout without token', async () => {
//     const response = await api.get("/quests/api/logout")
//     .expect(401);
//     expect(response.body.code).toEqual("invalid_token");
//   });

//   // CHECKME: Cookie in response
//   test('logout with token', async () => {
//     const response = await api.get("/quests/api/logout")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);
//   });

//   test("validate expired token", async () => {
//     const response = await api.get("/quests/api/vm/dragon-silver")
//     .set({"Cookie": `access=${tokenToExpire}`})
//     .expect(401);
//   });

//   test("mint nft without token", async () => {
//     const response = await api.post("/quests/api/mint-test-nft")
//     .expect(401)
//     expect(response.body.code).toEqual("invalid_token");
//   })

//   test("mint nft with asset management error", async () => {
//     assetManagementServiceClient.grant = jest.fn(async (): Promise<GrantResponse> => {
//       return {
//         status: "invalid",
//         reason: "example reason"
//       }
//     })

//     jest.spyOn(randomNft, "getCollectionPolicy").mockImplementation(async (): Promise<string> => {
//       return "someString"
//     })

//     const response = await api.post("/quests/api/mint-test-nft")
//     .set({"Cookie": `access=${token}`})
//     .expect(400);
//     expect(typeof response.body).toEqual("object");
//   })

//   test("mint nft with token", async () => {
//     jest.spyOn(randomNft, "getCollectionPolicy").mockImplementation(async (): Promise<string> => {
//       return "someString"
//     })
//     const response = await api.post("/quests/api/mint-test-nft")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);
//     expect(typeof response.body).toEqual("object");
//   })

//   test("submit signature", async () => {
//     const response = await api.post("/quests/api/submit-tx")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       tx: "signature",
//       witness: "witness"
//     })
//     .expect(200);
//   })
// })

// /*************** Adventurer tests ***************/
// describe("Adventurer Tests", () => {
//   test("get adventurers without token", async () => {
//     const response = await api.get("/quests/api/adventurers")
//     .expect(401);
//     expect(response.body.code).toEqual("invalid_token");
//   });

//   test("get adventurers with token", async () => {
//     const response = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);
  
//     expect(response.body).toHaveLength(6);
//     const nftNames = response.body.map((obj: any) => {
//       return obj.on_chain_ref
//     });
//     expect(nftNames).toContain("PixelTile1");
//     expect(nftNames).toContain("PixelTile11");
//     expect(nftNames).toContain("PixelTile12");
//     expect(nftNames).toContain("GrandmasterAdventurer8681");
//     expect(nftNames).toContain("GrandmasterAdventurer2609");
//   });
// })

// /*************** Quest tests ***************/
// describe("Quest Tests", () => {
//   test("get quests without token", async () => {
//     const response = await api.get("/quests/api/quests")
//     .expect(401);
//     expect(response.body.code).toEqual("invalid_token");
//   });

//   test("get quests with token", async () => {
//     const response = await api.get('/quests/api/quests')
//     .set({"Cookie": `access=${token}`})
//     .expect(200);
//     expect(response.body).toHaveLength(4);

//     const questNames = response.body.map((obj: any) => {
//       return obj.name;
//     });
//     expect(questNames).toContain("Quest 1");
//     expect(questNames).toContain("Quest 2");
//     expect(questNames).toContain("Quest 3");
//     expect(questNames).toContain("Quest 4");
//   });

//   test("accept quest without token", async () => {
//     const questResponse = await api.get("/quests/api/quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const adventurerResponse = await api.post("/quests/api/accept")
//     .send({
//       "quest_id": questResponse.body[0].id,
//       "adventurer_ids": [
//           "fbf1538f-3dac-4681-9634-9c27e87cc9d4",
//       ]
//     }).expect(401)
//   });

//   test("accept quest with token", async () => {
//     const questResponse = await api.get("/quests/api/quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const adventurerResponse = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": questResponse.body[0].id,
//       "adventurer_ids": [
//           adventurerResponse.body[0].id,
//       ]
//     }).expect(201);
//   });

//   test("accept quest request without quest", async () => {
//     const adventurerResponse = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "adventurer_ids": [
//           adventurerResponse.body[0].id,
//       ]
//     })
//     .expect(400)
//     expect(questAcceptResponse.body.code).toEqual("quest_not_provided")
//   });

//   test("accept quest request with wrong quest", async () => {
//     const adventurerResponse = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": "e5eed279-c71f-4781-b1f8-261b57e1e692",
//       "adventurer_ids": [
//           adventurerResponse.body[0].id,
//       ]
//     })
//     .expect(404)
//     expect(questAcceptResponse.body.code).toEqual("quest_not_found")
//   })

//   test("accept quest without adventurers", async () => {
//     const questResponse = await api.get("/quests/api/quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": questResponse.body[0].id,
//       "adventurer_ids": []
//     }).expect(400);
//     expect(questAcceptResponse.body.code).toEqual("not_enough_adventurers");
//   })

//   test("accept quest without adventurers in json", async () => {
//     const questResponse = await api.get("/quests/api/quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": questResponse.body[0].id,
//     }).expect(400);
//     expect(questAcceptResponse.body.code).toEqual("invalid_adventurers");
//   })

//   test("accept quest with in quest adventurers", async () => {
//     const questResponse = await api.get("/quests/api/quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const adventurerResponse = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": questResponse.body[0].id,
//       "adventurer_ids": [
//           adventurerResponse.body[0].id,
//       ]
//     }).expect(201);

//     const secondQuestAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": questResponse.body[0].id,
//       "adventurer_ids": [
//           adventurerResponse.body[0].id,
//       ]
//     }).expect(400);
//     expect(secondQuestAcceptResponse.body.code).toEqual("adventurer_not_available");
//   })

//   test("accept quest with too many adventurers", async () => {
//     const questResponse = await api.get("/quests/api/quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const adventurerResponse = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": questResponse.body[0].id,
//       "adventurer_ids": [
//           adventurerResponse.body[0].id,
//           adventurerResponse.body[1].id,
//       ]
//     }).expect(400);
//     expect(questAcceptResponse.body.code).toEqual("too_many_adventurers");
//   });

//   test("get taken quests without token", async () => {
//     const response = await api.get("/quests/api/taken-quests")
//     .expect(401)
//     expect(response.body.code).toEqual("invalid_token")
//   });

//   test("get taken quests with token", async () => {
//     const response = await api.get("/quests/api/taken-quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200)
//     expect(response.body).toHaveLength(2)
//   });

//   test("claim reward", async () => {
//     const quest = await Quest.findOne({
//       where: {
//         name: "Quest 1"
//       }
//     })
//     const adventurerResponse = await api.get("/quests/api/adventurers")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": quest?.getDataValue("id"),
//       "adventurer_ids": [
//           adventurerResponse.body[0].id
//       ]
//     }).expect(201);

//     await api.get("/quests/api/taken-quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const claimResponse = await api.post("/quests/api/claim")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "taken_quest_id": questAcceptResponse.body.id
//     }).expect(200);
    
//   });

//   test("claim failed reward", async () => {
//     await new Promise(resolve => setTimeout(resolve, 2100));
//     const quest = await Quest.findOne({
//       where: {
//         name: "Quest 5"
//       }
//     })

//     const adventurer = await Adventurer.findOne({
//       where: {
//         "in_quest": false
//       }
//     })

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": quest?.getDataValue("id"),
//       "adventurer_ids": [
//         adventurer?.getDataValue("id")
//       ]
//     }).expect(201);

//     await api.get("/quests/api/taken-quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const claimResponse = await api.post("/quests/api/claim")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "taken_quest_id": questAcceptResponse.body.id
//     }).expect(200);
//     expect(Object.keys(claimResponse.body)).toContain("dead_adventurers")
//   });

//   test("claim reward without waiting", async () => {
//     const quest = await Quest.findOne({
//       where: {
//         name: "Quest 5"
//       }
//     });

//     const adventurer = await Adventurer.findOne({
//       where: {
//         "in_quest": false
//       }
//     });

//     const questAcceptResponse = await api.post("/quests/api/accept")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "quest_id": quest?.getDataValue("id"),
//       "adventurer_ids": [
//         adventurer?.getDataValue("id")
//       ]
//     }).expect(201);

//     await api.get("/quests/api/taken-quests")
//     .set({"Cookie": `access=${token}`})
//     .expect(200);

//     const claimResponse = await api.post("/quests/api/claim")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "taken_quest_id": questAcceptResponse.body.id
//     }).expect(409);
//     expect(claimResponse.body.code).toEqual("too_many_requests")
//   });

//   test("claim reward already claimed", async () => {
//     await new Promise(resolve => setTimeout(resolve, 2001));
//     const takenQuest = await TakenQuest.findOne({
//       attributes: ["id"],
//       where: {
//         is_claimed: true
//       }
//     })

//     const failedResponse = await api.post("/quests/api/claim")
//     .set({"Cookie": `access=${token}`})
//     .send({
//       "taken_quest_id": takenQuest?.getDataValue("id")
//     }).expect(400);
//     expect(failedResponse.body.code).toEqual("quest_already_claimed")
//   });

// })

// describe("Error testing", () => {
//   test("validate invalid address", async () => {
//     identityServiceClient.resolveUser = jest.fn(async (): Promise<ResolveUserResponse> => {
//       return {
//         status: "ok",
//         info: {
//           userId: "alonsobear", 
//           nickname: "aBear", 
//           knownStakeAddresses: ["stake1uptnf9euyfp8fexjn89l22x54w05xneeq4fs0rrcd4q5p6crvsf4k"]
//            }
//          }
//      })
//     const response = await api.get("/quests/api/vm/dragon-silver")
//     .set({"Cookie": `access=${invalidToken}`})
//     .expect(400);
//     expect(response.body.code).toEqual("address_not_valid");
//   });
// })