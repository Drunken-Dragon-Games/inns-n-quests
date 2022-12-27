// import { buildApp } from "../app"
// import { Server } from "http"

// import * as mock from "./mockServices"
// import * as flow from "./flow"

// import registry from "../assets/registry";

// let server: Server

// beforeAll(async () => {

//     // const app = buildApp()
//     // server = app.listen(0, () => console.log(`Server running...`))
//     await mock.registryOk()
//     // await registry.load()
// });

// afterAll(async () => {
//     server.close();
// })



// test("ok create account using wallet", async () => {
//     await mock.CreateSigNonceOk()
//     await mock.AuthenticateOK()
//     await flow.okWalletAccount()
// })

// test("ok create account using discord", async () => {
//     await mock.AuthenticateOK()
//     await flow.okDiscordAccount()
// })

// test("bad autenticate wallet",async () => {
//     await mock.CreateSigNonceBad()
//     await mock.AuthenticateBad()
//     await flow.badWalletAccount()
// })

// test("bad autenticate discord",async () => {
//     await mock.AuthenticateBad()
//     await flow.badDiscordAccount()
// })

// test("ok assosiate wallet",async () => {
//     await mock.CreateSigNonceOk()
//     await mock.AssociateOk()
//     await mock.resolveUserOk()
//     await flow.okAssociateWallet()
// })

// test("ok assosiate discord",async () => {
//     await mock.AssociateOk()
//     await mock.resolveUserOk()
//     await flow.okAssociateDiscord()
// })

// test("bad assosiate wallet",async () => {
//     await mock.CreateSigNonceOk()
//     await mock.Associatebad("bad-credentials")
//     await mock.resolveUserOk()
//     await flow.badAssociateWallet()
// })

// test("bad assosiate discord",async () => {
//     await mock.CreateSigNonceOk()
//     await mock.Associatebad("bad-credentials")
//     await mock.resolveUserOk()
//     await flow.badAssociateDiscord()
// })

// test("ok getAccount Data",async () => {
//     await mock.resolveUserOk()
//     await flow.okGetAccountData()
// })

// test("bad getAccount Data",async () => {
//     await mock.resolveUserBad()
//     await flow.badGetAccountData()
// })

// test("ok UserInfo",async () => {
//     await mock.resolveSessionOk()
//     await mock.registryOk()
//     await mock.ListOk()
//     await flow.getInfoOk()
// })

// test("bad UserInfo-Session",async () => {
//     await mock.resolveSessionBad("unknown-session-id")
//     await mock.registryOk()
//     await mock.ListOk()
//     await flow.getInfoBad("session")
// })

// test("bad UserInfo-List",async () => {
//     await mock.resolveSessionOk()
//     await mock.registryOk()
//     await mock.ListBad()
//     await flow.getInfoBad("list")
// })

// test("ok set nickname",async () => {
//     await mock.SetNicknameOk()
//     await mock.resolveUserOk()
//     await flow.setNicknameOk()
// })

// test("bad set nickname",async () => {
//     await mock.SetNicknameBad()
//     await mock.resolveUserBad()
//     await flow.setNicknameBad()
// })

// test("ok refresh token",async () => {
//     await mock.AuthenticateOK()
//     await mock.RefreshOk()
//     await flow.useRefreshTokenOk()
// })

// test("bad refresh token",async () => {
//     await mock.AuthenticateOK()
//     await mock.RefreshBad()
//     await flow.useRefreshTokenBad()
// })

// test("invalid refresh token",async () => {
//     await mock.AuthenticateOK()
//     await mock.RefreshBad()
//     await flow.useRefreshTokenInvalid()
// })