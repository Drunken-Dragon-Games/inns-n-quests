import { CollectionService } from "../../service-collection"

export default class CollectionServiceMock {

    public readonly service: CollectionService

    constructor() {
        this.service = {
            loadDatabaseModels: jest.fn(),
            unloadDatabaseModels: jest.fn(),
            getCollection: jest.fn(),
            getCollectionWithUIMetadata: jest.fn(),
            getPassiveStakingInfo: jest.fn(),
            updateGlobalDailyStakingContributions: jest.fn(),
            grantGlobalWeeklyStakingGrant: jest.fn(),
            getMortalCollection: jest.fn(),
            addMortalCollectible: jest.fn(),
            removeMortalCollectible: jest.fn(),
            syncUserCollection: jest.fn(),
            setMortalCollection: jest.fn(),
            lockAllUsersCollections: jest.fn(),
        }
    }

}
