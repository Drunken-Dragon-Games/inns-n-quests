import { AssetManagementService, ListResponse } from "../../service-asset-management";

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
            claim: jest.fn(),
            submitClaimSignature: jest.fn(),
            claimStatus: jest.fn(),
            revertStaledClaims: jest.fn(),
        }
    }
    
    listReturns(response: ListResponse) {
        return jest.spyOn(this.service, "list")
            .mockReturnValueOnce(Promise.resolve(response))
    }
}