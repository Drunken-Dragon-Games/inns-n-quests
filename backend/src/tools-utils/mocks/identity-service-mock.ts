import { IdentityService, ResolveUserResult } from "../../service-identity.js"

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
            refresh: jest.fn(),
            listSessions: jest.fn(),
            signout: jest.fn(),
            resolveUser: jest.fn(),
            resolveUsers: jest.fn(),
            resolveSession: jest.fn(),
            updateUser: jest.fn(),
            createAuthTxState: jest.fn(),
            verifyAuthState: jest.fn(),
            cleanAssociationTx: jest.fn(),
            getTotalUsers: jest.fn(),
        }
    }

    resolveUserReturns(response: ResolveUserResult) {
        return jest.spyOn(this.service, "resolveUser")
            .mockReturnValueOnce(Promise.resolve(response))
    }
}
