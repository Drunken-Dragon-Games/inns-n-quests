import { ListResponse } from "../service-asset-management";
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock";
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock";
import { Collection } from "./models";
import { CollectionService } from "./service-spec";
import { relevantPolicies } from "./state/dsl";


interface CollectionResponse {
    ctype: string;
    collection: Collection<{}>
}


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

    areCollectionsEqual(col1: CollectionResponse, col2: CollectionResponse): boolean {
        if (col1.ctype !== col2.ctype) return false
    
        const collections1: Collection<{}> = col1.collection
        const collections2: Collection<{}> = col2.collection
    
        for (let key in collections1) {
            if (!this.isCollectionKey(key)) return false
            
            const array1 = collections1[key].sort((a, b) => a.assetRef.localeCompare(b.assetRef))
            const array2 = collections2[key].sort((a, b) => a.assetRef.localeCompare(b.assetRef))
    
            if (array1.length !== array2.length) return false
    
            for (let i = 0; i < array1.length; i++) {
                if (array1[i].assetRef !== array2[i].assetRef || 
                    array1[i].quantity !== array2[i].quantity || 
                    array1[i].type !== array2[i].type) return false
            }
        }
    
        return true
    }

    private isCollectionKey(key: string): key is typeof relevantPolicies[number] {
        const r: string[] = [...relevantPolicies]
        return r.includes(key)
    }
    
}