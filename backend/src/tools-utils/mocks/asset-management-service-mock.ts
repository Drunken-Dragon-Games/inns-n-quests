import { AssetManagementService, ListResponse } from "../../service-asset-management.js";

export default class AssetManagementServiceMock {

    public readonly service: AssetManagementService

    constructor() {
        this.service = {
            loadDatabaseModels: jest.fn(),
            unloadDatabaseModels: jest.fn(),
            health: jest.fn(),
            list: jest.fn(),
            grant: jest.fn(),
            grantMany: jest.fn(),
            userClaims: jest.fn(),
            claim: jest.fn(),
            submitClaimSignature: jest.fn(),
            claimStatus: jest.fn(),
            revertStaledClaims: jest.fn(),
            createAssociationTx: jest.fn(),
            submitAuthTransaction: jest.fn(),
        }
    }
    
    listReturns(response: ListResponse) {
        return jest.spyOn(this.service, "list")
            .mockReturnValueOnce(Promise.resolve(response))
    }
}