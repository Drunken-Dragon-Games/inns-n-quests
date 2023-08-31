import { GetCollectionLockResult, IdentityService, ResolveUserResult } from "../../service-identity"

export default class IdentityServiceMock {

    public readonly service: IdentityService

    constructor() {
        this.service = {
            loadDatabaseModels: jest.fn(),
            unloadDatabaseModels: jest.fn(),
            health: jest.fn(),
            createSigNonce: jest.fn(),
            authenticate: jest.fn(),
            register: jest.fn(),
            associate: jest.fn(),
            deassociateWallet: jest.fn(),
            refresh: jest.fn(),
            listSessions: jest.fn(),
            signout: jest.fn(),
            resolveUser: jest.fn(),
            resolveUsers: jest.fn(),
            resolveSession: jest.fn(),
            updateUser: jest.fn(),
            createAuthTxState: jest.fn(),
            verifyAuthState: jest.fn(),
            getTotalUsers: jest.fn(),
            completeAuthState: jest.fn(),
            listAllUserIds: jest.fn(),
            migrationFixDiscordUsernameInDB: jest.fn(),
            getCollectionLockState: jest.fn(),
            setCollectionLock: jest.fn(),
            setCollectionLockAll: jest.fn(),
        }
    }

    resolveUserReturns(response: ResolveUserResult) {
        return jest.spyOn(this.service, "resolveUser")
            .mockReturnValueOnce(Promise.resolve(response))
    }

    listAllUserIdsReturns(reponse: string[]){
        return jest.spyOn(this.service, "listAllUserIds")
            .mockReturnValue(Promise.resolve(reponse))
    }

    getCollectionLockStateReturns(response: GetCollectionLockResult){
        return jest.spyOn(this.service, "getCollectionLockState")
            .mockReturnValue(Promise.resolve(response))
    }
}
