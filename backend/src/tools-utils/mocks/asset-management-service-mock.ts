import { AssetManagementService } from "../../service-asset-management";

export default class AssetManagementServiceMock {

    public readonly service: AssetManagementService

    constructor() {
        this.service = {
            loadDatabaseModels: jest.fn(),
            unloadDatabaseModels: jest.fn(),
            health: jest.fn(),
            list: jest.fn(),
            grant: jest.fn(),
            claim: jest.fn(),
            submitClaimSignature: jest.fn(),
            claimStatus: jest.fn(),
            revertStaledClaims: jest.fn(),
        }
    }
}