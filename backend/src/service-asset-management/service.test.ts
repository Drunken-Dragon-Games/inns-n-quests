import ServiceTestDsl, { IdentityServiceMock, SecureSigningServiceMock } from "./service.test-dsl";
import { AssetManagementService } from "./service-spec";
import { AssetManagementServiceDsl } from "./service";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { connectToDB, DBConfig } from "../tools-database";

let dsl: ServiceTestDsl
let service: AssetManagementService

const databaseConfig: DBConfig = 
    { host: "localhost"
    , port: 5432
    , username: "postgres"
    , password: "admin"
    , database: "service_db" 
    }

beforeEach(async () => {
    const identityService = IdentityServiceMock.buildInterface()
    const secureSigningService = SecureSigningServiceMock.buildInterface()
    const blockfrost = new BlockFrostAPI({ projectId: "preprod00000000000000000000000000000000" })
    service = await AssetManagementServiceDsl.loadFromConfig(
        { environment: "local"
        , claimsConfig: 
            { feeAddress: "addr_test1qr50mcpmrfavg9ca0pd7mq3gc9uvqhr7gm78f346e2cc07l7u3q390npuc24v47udvsrr7h0t4d4m26h4f6gjpvw393sfwrk9j"
            , feeAmount: "1000000"
            , txTTL: 60 * 2 
            }
        },
        { database: connectToDB(databaseConfig)
        , blockfrost 
        , identityService
        , secureSigningService
        }
    )
    dsl = new ServiceTestDsl(
        identityService,
        secureSigningService,
        blockfrost,
        service
    )
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

test("health endpoint", async () => {
    expect(await dsl.service.health()).toStrictEqual({
        status: "ok",
        dependencies: [{ name: "database", status: "ok" }] 
    })
})

test("Retrieve onchain assets", async () => {
    const user = await dsl.createUser()
    dsl.withOnChainAssets(user, [{ policyId: dsl.testTokenPolicyId, assetName: "TestToken", quantity: "10000000" }])
    const inventory = await dsl.inventory(user)
    expect(inventory[dsl.testTokenPolicyId]).toStrictEqual([{ 
        unit: "TestToken", 
        quantity: "10000000", 
        chain: true 
    }])
})

test("Grant and retirieve offchain assets", async () => {
    const user = await dsl.createUser()
    await dsl.grantTestToken(user, "200")
    await dsl.grantTestToken(user, "300")
    dsl.withOnChainAssets(user, [])
    const inventory = await dsl.inventory(user)
    expect(inventory[dsl.testTokenPolicyId]).toStrictEqual([{ 
        unit: "TestToken", 
        quantity: "500", 
        chain: false 
    }])
})

test("Retrieve combined assets", async () => {
    const user = await dsl.createUser()
    await dsl.grantTestToken(user, "200")
    await dsl.grantTestToken(user, "300")
    dsl.withOnChainAssets(user, [{ policyId: dsl.testTokenPolicyId, assetName: "TestToken", quantity: "10000000" }])
    const inventory = await dsl.inventory(user)
    expect(inventory[dsl.testTokenPolicyId]).toStrictEqual([
        { 
            unit: "TestToken",
            quantity: "500",
            chain: false
        },
        { 
            unit: "TestToken",
            quantity: "10000000",
            chain: true 
        },
    ])
})

/*
test("Claim assets: ok", async () => {
    const user = await dsl.createUser()
    await dsl.grantTestToken(user, "200")
    const claim = await dsl.claimTestToken(user, "150")
    const status1 = await dsl.checkClaimStatus(claim)
    expect(status1).toBe("created")
    dsl.withOnChainAssets(user, [])
    const inventory1 = await dsl.inventory(user)
    expect(inventory1[dsl.testTokenPolicyId]).toStrictEqual([{ 
        unit: "TestToken", 
        quantity: "50", 
        chain: false 
    }])
    const txId = await dsl.signClaimAndSubmit(user, claim)
    const status2 = await dsl.checkClaimStatus(claim)
    expect(status2).toBe("submitted")
    dsl.transactionIsInBlockchain(txId)
    const status3 = await dsl.checkClaimStatus(claim)
    expect(status3).toBe("confirmed")
})

test("Claim assets all: ok", async () => {
    const user = await dsl.createUser()
    await dsl.grantTestToken(user, "200")
    const claim = await dsl.claimTestToken(user)
    const status1 = await dsl.checkClaimStatus(claim)
    expect(status1).toBe("created")
    dsl.withOnChainAssets(user, [])
    const inventory1 = await dsl.inventory(user)
    expect(inventory1[dsl.testTokenPolicyId]).toStrictEqual([{ 
        unit: "TestToken", 
        quantity: "0", 
        chain: false 
    }])
    const txId = await dsl.signClaimAndSubmit(user, claim)
    const status2 = await dsl.checkClaimStatus(claim)
    expect(status2).toBe("submitted")
    dsl.transactionIsInBlockchain(txId)
    const status3 = await dsl.checkClaimStatus(claim)
    expect(status3).toBe("confirmed")
})
*/