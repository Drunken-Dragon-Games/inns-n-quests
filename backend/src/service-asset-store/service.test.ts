import { DBConfig, connectToDB } from "../tools-database"
import AssetManagementServiceMock from "../tools-utils/mocks/asset-management-service-mock"
import BlockchainServiceMock from "../tools-utils/mocks/blockchain-service-mock"
import BlockFrostAPIMock from "../tools-utils/mocks/blockfrost-api-mock"
import { AssetStoreDSL } from "./service"
import { AotStoreService } from "./service-spec"
import { testPolicies } from "../tools-utils/mocks/test-policies"

let service: AotStoreService
const userId = "b1925e1f-6820-4155-a917-fa68873906a7"

const databaseConfig: DBConfig = 
    { host: "localhost"
    , port: 5432
    , username: "postgres"
    , password: "admin"
    , database: "service_db" 
    }

beforeEach(async () => {
    const blockchainService = new BlockchainServiceMock()
    const assetManagementService = new AssetManagementServiceMock()
    const blockfrost = new BlockFrostAPIMock()

    assetManagementService.listByAddressReturns({ status: "ok", inventory: {
        [testPolicies.adventurersOfThiolden.policyId]: [
            { unit: "AdventurerOfThiolden1", quantity: "1", chain: true },
            { unit: "AdventurerOfThiolden2", quantity: "1", chain: true },
        ]
    }})

    blockchainService.buildAssetsSellTxReturns({"status": "ok", "value": {"rawTransaction": "transaction","txHash": "hash"}})

    service = await AssetStoreDSL.loadFromConfig(
        { inventoryAddress: "Address", AOTPrice: 50, AOTPolicy: testPolicies.adventurersOfThiolden.policyId, txTTL: 15 * 60}, 
        {
            database: connectToDB(databaseConfig), 
            blockchainService: blockchainService.service, 
            blockfrost: blockfrost.service, 
            assetManagementService: assetManagementService.service
        })

})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

test("reserve and get asset Transaction", async () => {
    const transactionResult = await service.reserveAndGetAssetsSellTx("", 2, userId)
    if (transactionResult.ctype !== "success") fail(`test to reserve assets failed because: ${transactionResult.error}`)
    expect(transactionResult.tx).toEqual("transaction")
    const orders = await service.getAllUserOrders(userId)
    expect(orders[0].orderId).toEqual(transactionResult.orderId)
    const assets = orders[0].assets
    const transactionResult2 = await service.reserveAndGetAssetsSellTx("", 2, userId)
    if (transactionResult2.ctype !== "failure") fail(`test to reserve assets failed becouse coudl reserve beyond limit`)
})