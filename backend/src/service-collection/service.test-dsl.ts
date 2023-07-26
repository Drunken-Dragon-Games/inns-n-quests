import { ListResponse } from "../service-asset-management";
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock";
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock";
import { CollectionService } from "./service-spec";

export default class ServiceTestDsl {

    constructor(
        private readonly identityService: IdentityServiceMock,
        private readonly assetManagementService: AssetManagementServiceMock,
        public readonly service: CollectionService
    ) {}

    //mock the asset seice response once
    assetListReturnsOnce(response: ListResponse){
        this.assetManagementService.listReturns(response)
    }
}