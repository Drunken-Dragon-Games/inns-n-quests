// import * as s from "../../service-identity.js"

// import * as a from "../../service-asset-management.js"
// import {assetClient} from "../assets/client.js"

// import { SECRET_KEY } from "../settings.js"
// import jwt from "jsonwebtoken";

// import { logger } from "../base-logger.js"

// export const CreateSigNonceOk =async () => {
//     identityClient.createSigNonce = jest.fn(async (address: string, logger): Promise<s.CreateNonceResult> => {
//         return {
//           status: "ok",
//           nonce: "aaaaabbbbbcccccddddd"
//         }
//       })
// }


// export const AuthenticateOK = async () => {
//     const buildTokens = (authType: s.AuthType) => {
//         const session: s.Session = {
//             userId: "user",
//             sessionId: "session",
//             authType: authType,
//             expiration: 1232
//         }

//         const okTokens: s.AuthenticationTokens = {
//             session: session,
//             refreshToken: "whatver"
//         }

//         return okTokens
//     }

//     identityClient.authenticate = jest.fn(async (credentials: s.Credentials, logger): Promise<s.AuthenticationResponse> => {
//         let authType: s.AuthType
//         if (credentials.ctype == "discord") { authType = "Discord" }else if (credentials.ctype == "sig"){authType = "Sig"}else{authType = "Email"}
//         return {
//             status: "ok",
//             tokens: buildTokens(authType)
//         }
//       })
// }

// export const AuthenticateBad =async () => {
//     identityClient.authenticate = jest.fn(async (credentials: s.Credentials, logger): Promise<s.AuthenticationResponse> => {
//         return {
//             status: "bad-credentials"
//         }
//       })
// }

// export const CreateSigNonceBad =async () => {
//     identityClient.createSigNonce = jest.fn(async (address: string, logger): Promise<s.CreateNonceResponse> => {
//         return {
//           status: "bad-address"
//         }
//       })
// }

// export const AssociateOk = async () => {
//     identityClient.associate = jest.fn(async (userId: string, credentials: s.Credentials, logger): Promise<s.AssociationResponse> => {
//         return {
//           status: "ok"
//         }
//       })
// }

// type AssociateError = "bad-credentials" | "stake-address-used" | "discord-used"

// export const Associatebad = async (error: AssociateError) => {
//     identityClient.associate = jest.fn(async (userId: string, credentials: s.Credentials, logger): Promise<s.AssociationResponse> => {
//         return {
//           status: error
//         }
//       })
// }

// export const buildSession = (authType: s.AuthType) => {
//     const sessionData: s.Session = {
//         userId: "string", 
//         sessionId: "string", 
//         authType: authType, 
//         expiration: Date.now() + 20000
//     }
    
//     return jwt.sign(sessionData, SECRET_KEY);
// }

// export const buildSessionToExpire = (authType: s.AuthType) => {
//     const sessionData: s.Session = {
//         userId: "string", 
//         sessionId: "string", 
//         authType: authType, 
//         expiration: Date.now() - 20000
//     }
    
//     return jwt.sign(sessionData, SECRET_KEY);
// }

// export const resolveUserOk =async () => {
//     const UserInfo = {
//         userId: "string", 
//         nickname: "username#1234", 
//         knownStakeAddresses: []
//     } 


//     identityClient.resolveUser = jest.fn(async (info: { ctype: "user-id", userId: string }, logger): Promise<s.ResolveUserResponse> => {
//         return {
//             status: "ok",
//             info: UserInfo
//         }
//       })
// }

// export const resolveUserBad =async () => {
//     identityClient.resolveUser = jest.fn(async (info: { ctype: "user-id", userId: string }, logger): Promise<s.ResolveUserResponse> => {
//         return {
//             status: "unknown-user-id",
//         }
//       })
// }

// export const resolveSessionOk =async () => {
//     const UserFullInfo = {
//         userId: "string", 
//         nickname: "username#1234", 
//         knownStakeAddresses: [],
//         imageLink: "https://i.pinimg.com/originals/cb/bb/01/cbbb01ba5005cf4e124dea5cb06ef291.png",
//         knownEmail: "email@mail.com"
//     }


//     identityClient.resolveSession = jest.fn(async (sessionId: string, logger): Promise<s.ResolveSesionResponse> => {
//         return {
//             status: "ok",
//             info: UserFullInfo
//         }
//       })
// }

// export const registryOk =async () => {
//     const policys: a.RegistryPolicy[] = [
//     { policyId: "123"
//     , name: "Dragon Silver"
//     , description: ""
//     , tags: []
//     },
//     { policyId: "456"
//     , name: "Grandmaster Adventurers"
//     , description: ""
//     , tags: []
//     }]
        


//     assetClient.registry = jest.fn(async (logger): Promise<a.RegistryPolicy[]> => {
//         return policys
//       })

// }

// export const ListOk =async () => {
//     const Inventory: a.Inventory = {
//         "123": [
//             {unit: "", quantity: "420", chain: false},
//             {unit: "", quantity: "69", chain: true}
//         ],
//         "456": [
//             {unit: "", quantity: "1", chain: false},
//             {unit: "", quantity: "1", chain: false},
//             {unit: "", quantity: "1", chain: false},
//             {unit: "", quantity: "1", chain: true},
//             {unit: "", quantity: "1", chain: true},
//             {unit: "", quantity: "1", chain: true},
//             {unit: "", quantity: "1", chain: true},
//             {unit: "", quantity: "1", chain: true},
//         ]
//     }

//     assetClient.list = jest.fn(async (userId: string, logger): Promise<a.ListResponse> => {
//         return { status: "ok", inventory: Inventory }
//       })
// }

// type ResolveSessionError = "unknown-session-id" | "invalid-discord-token" | "unknown-user-id"

// export const resolveSessionBad =async (error: ResolveSessionError) => {
//     identityClient.resolveSession = jest.fn(async (sessionId: string, logger): Promise<s.ResolveSesionResponse> => {
//         return {
//             status: error
//         }
//       })
// }

// export const ListBad =async () => {
//     assetClient.list = jest.fn(async (userId: string, logger): Promise<a.ListResponse> => {
//         return { status: "unknown-user" }
//       })
// }

// export const SetNicknameOk =async () => {
//     identityClient.updateUser = jest.fn(async (userId: string, info: {nickname: string}, logger): Promise<s.UpdateUserResponse> => {
//         return {
//             status: "ok"
//         }
//       })
// }

// export const SetNicknameBad =async () => {
//     identityClient.updateUser = jest.fn(async (userId: string, info: {nickname: string}, logger): Promise<s.UpdateUserResponse> => {
//         return {
//             status: "nickname-unavailable"
//         }
//       })
// }

// export const RefreshOk = async () => {
//     const buildTokens = (authType: s.AuthType) => {
//         const session: s.Session = {
//             userId: "user",
//             sessionId: "session",
//             authType: authType,
//             expiration: 1232
//         }

//         const okTokens: s.AuthenticationTokens = {
//             session: session,
//             refreshToken: "whatver"
//         }

//         return okTokens
//     }

//     identityClient.refresh = jest.fn(async (): Promise<s.RefreshResponse> => {
//         return {
//             status: "ok",
//             tokens: buildTokens("Discord")
//         }
//     })
// }

// export const RefreshBad = async () => {
//     identityClient.refresh = jest.fn(async (): Promise<s.RefreshResponse> => {
//         return {
//             status: "bad-refresh-token"
//         }
//     })
// }