// const supertest = require("supertest");
// const { app } = require("../app")

// const api = supertest(app)
// const stakeAddress = 'stake1uxjh0huek6sj7w7qf9hmlzq9k46spggmk5hv6vk24am5uqsfl3pp9'
// const workingSignature = '84582aa201276761646472657373581de1a577df99b6a12f3bc0496fbf8805b57500a11bb52ecd32caaf774e02a166686173686564f4536c6f6f6b696e676172726f756e64617265776558407cb5964b0ea9e6704120d21f7ad559e37583f590db5288b2fb71ee592e48f3a48272fd584634d8c7d697f0858614e64624dae31fc61035de2bb082441fdd7d0b'
// const workingKey = 'a40101032720062158209701ab0d6a4204abc52e73a337588d40c004f9f280922881f8fe0c177aac816b'

// import {buildSession, buildSessionToExpire} from "./mockServices"

// export const okWalletAccount =async () => {
//     const r = await api.post("/api/validate").send({ stakeAddress: stakeAddress }).expect(201);
//     expect(r.body.responseCode).toEqual("nonce_generated");
//     expect(r.body.nonce).toEqual("aaaaabbbbbcccccddddd");

//     const response = await api.post(`/api/validate/${r.body.nonce}`).send({signature: workingSignature,key: workingKey}).expect(201)
//     expect(response.body.responseCode).toEqual("user_created")
//     expect(response.headers["set-cookie"][0]).toContain("access")
// }

// export const okDiscordAccount =async () => {
//     const response = await api.post("/api/discordRegistration").send({ code: "whatever" }).expect(201);
//     expect(response.body.responseCode).toEqual("user_created")
//     expect(response.headers["set-cookie"][0]).toContain("access")
// }

// export const badWalletAccount = async () => {
//     const r = await api.post("/api/validate").send({ stakeAddress: stakeAddress }).expect(400);
//     expect(r.body.responseCode).toEqual("bad-address");

//     const response = await api.post(`/api/validate/${r.body.nonce}`).send({signature: workingSignature,key: workingKey}).expect(401)
//     expect(response.body.responseCode).toEqual("bad-credentials")
// }

// export const badDiscordAccount =async () => {
//     const response = await api.post("/api/discordRegistration").send({ code: "whatever" }).expect(401);
//     expect(response.body.responseCode).toEqual("bad-credentials")
// }

// export const okAssociateWallet =async () => {
//     const r = await api.post("/api/validate").send({ stakeAddress: stakeAddress }).expect(201);
//     expect(r.body.responseCode).toEqual("nonce_generated");
//     expect(r.body.nonce).toEqual("aaaaabbbbbcccccddddd");
//     const session = buildSession("Sig")
//     const response = await api.post(`/api/validateWallet/${r.body.nonce}`).send({signature: workingSignature,key: workingKey})
//     .set({"Cookie": `access=${session}`}).expect(200)
//     expect(response.body.responseCode).toEqual("wallet-associated")
// }

// export const badAssociateWallet =async () => {
//     const r = await api.post("/api/validate").send({ stakeAddress: stakeAddress }).expect(201);
//     expect(r.body.responseCode).toEqual("nonce_generated");
//     expect(r.body.nonce).toEqual("aaaaabbbbbcccccddddd");
//     const session = buildSession("Sig")
//     const response = await api.post(`/api/validateWallet/${r.body.nonce}`).send({signature: workingSignature,key: workingKey})
//     .set({"Cookie": `access=${session}`}).expect(409)
//     expect(response.body.responseCode).toEqual("associate status: bad-credentials, userinfo status: ok")
// }

// export const okAssociateDiscord =async () => {
//     const session = buildSession("Discord")
//     const response = await api.post(`/api/validateDiscord`).send({code: "whatever"})
//     .set({"Cookie": `access=${session}`}).expect(200)
//     expect(response.body.responseCode).toEqual("discord-associated")
// }

// export const badAssociateDiscord =async () => {
//     const session = buildSession("Discord")
//     const response = await api.post(`/api/validateDiscord`).send({code: "whatever"})
//     .set({"Cookie": `access=${session}`}).expect(409)
//     expect(response.body.responseCode).toEqual("associate status: bad-credentials, userinfo status: ok")
// }

// export const okGetAccountData =async () => {
//     const session = buildSession("Discord")
//     const response = await api.get(`/api/accountData`)
//     .set({"Cookie": `access=${session}`})
//     .expect(200)

//     expect(response.body.nickName).toEqual("username")
//     expect(response.body.nameIdentifier).toEqual("1234")
// }

// export const badGetAccountData =async () => {
//     const session = buildSession("Discord")
//     const response = await api.get(`/api/accountData`)
//     .set({"Cookie": `access=${session}`})
//     .expect(400)

//     expect(response.body.responseCode).toEqual("unknown-user-id")
// }

// export const getInfoOk =async () => {
//     const session = buildSession("Discord")
//     const response = await api.get(`/api/UserInfo`)
//     .set({"Cookie": `access=${session}`}).expect(201)
//     expect(response.body.amountNFT).toBe(8)
//     expect(response.body.nickName).toBe("username#1234")
//     expect(response.body.DSTC).toBe("420")
//     expect(response.body.DS).toBe("69")
// }

// type getInfoError = "session" | "list"

// export const getInfoBad =async (error: getInfoError) => {
//     const session = buildSession("Discord")
    
//     if (error == "session"){
//         const response = await api.get(`/api/UserInfo`)
//     .set({"Cookie": `access=${session}`}).expect(401)
//     expect(response.body.responseCode).toBe("canot get user info")
//     } 
//     if (error == "list"){
//         const response = await api.get(`/api/UserInfo`)
//     .set({"Cookie": `access=${session}`}).expect(400)
//     expect(response.body.responseCode).toBe("could not get assets")
//     }
// }

// export const setNicknameOk =async () => {
//     const session = buildSession("Discord")
//     const response = await api.post(`/api/setNickName`)
//     .send({nickname: "whatever"})
//     .set({"Cookie": `access=${session}`}).expect(200)
//     expect(response.body.responseCode).toBe("nickname Updated")
// }

// export const setNicknameBad =async () => {
//     const session = buildSession("Discord")
//     const response = await api.post(`/api/setNickName`)
//     .send({nickname: "whatever"})
//     .set({"Cookie": `access=${session}`}).expect(409)
//     expect(response.body.responseCode).toBe("updateUserReponse status is nickname-unavailable, userInfo response is unknown-user-id")
// }

// export const useRefreshTokenOk =async () => {
//     let response = await api.post("/api/discordRegistration").send({ code: "whatever" }).expect(201);
//     const fullRefreshToken = response.body.refreshToken
//     const session = buildSessionToExpire("Discord")
//     response = await api.get(`/api/accountData`)
//     .set({"Cookie": `access=${session}`})
//     .expect(401)
//     response = await api.post('/api/refreshSession').send({fullRefreshToken}).expect(200)
//     expect(response.body.responseCode).toEqual("session_refreshed")
//     expect(response.headers["set-cookie"][0]).toContain("access")
// }

// export const useRefreshTokenBad =async () => {
//     let response = await api.post("/api/discordRegistration").send({ code: "whatever" }).expect(201);
//     const fullRefreshToken = response.body.refreshToken
//     const session = buildSessionToExpire("Discord")
//     response = await api.get(`/api/accountData`)
//     .set({"Cookie": `access=${session}`})
//     .expect(401)
//     response = await api.post('/api/refreshSession').send({fullRefreshToken}).expect(401)
// }

// export const useRefreshTokenInvalid = async () => {
//     let response = await api.post("/api/discordRegistration").send({ code: "whatever" }).expect(201);
//     const fullRefreshToken = 'ghdsafvdsgakhjfgdvsfjhg'
//     const session = buildSessionToExpire("Discord")
//     response = await api.get(`/api/accountData`)
//     .set({"Cookie": `access=${session}`})
//     .expect(401)
//     response = await api.post('/api/refreshSession').send({fullRefreshToken}).expect(401)
// }