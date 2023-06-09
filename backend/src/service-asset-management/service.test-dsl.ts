import fs from "fs/promises"
import cbor from "cbor"
import { v4 } from "uuid"
import { AssetManagementService, ClaimStatus, Inventory } from "../service-asset-management.js"

import path from "path"
import { Transaction } from "@emurgo/cardano-serialization-lib-nodejs"
import { Wallet, cardano } from "../tools-cardano.js"
import { failure, success, unit } from "../tools-utils.js"
import { expectResponse } from "../tools-utils/api-expectations.js"
import IdentityServiceMock from "../tools-utils/mocks/identity-service-mock.js"
import SecureSigningServiceMock from "../tools-utils/mocks/secure-signing-service-mock.js"
import BlockFrostAPIMock from "../tools-utils/mocks/blockfrost-api-mock.js"
import { UserInfo } from "../service-identity.js"

export type User = {
    info: UserInfo
    wallet: Wallet
}

export type TestClaim = {
    claimId: string, 
    tx: string, 
    policySigner: Wallet 
}

export default class ServiceTestDsl {

    public readonly testTokenPolicyId = "cd597b903fb228d7e3fac443f9ddb19b3d91bf6b552f38f074386307"

    constructor(
        private readonly identityService: IdentityServiceMock,
        private readonly secureSigningService: SecureSigningServiceMock,
        private readonly blockfrost: BlockFrostAPIMock,
        public readonly service: AssetManagementService
    ) {}

    async createUser(options?: { nickname?: string, addresses?: string[] }): Promise<User> {
        const wallet = Wallet.recover("Preprod", 
            await fs.readFile(this.stubPath("user-wallet"), "utf8"), "password")
        return {
            info: {
                userId: v4(),
                nickname: options?.nickname ?? "user#0001",
                knownStakeAddresses: options?.addresses ?? [ wallet.stakeAddress().to_address().to_bech32() ]
            },
            wallet
        }
    }

    async grantTestToken(user: User, quantity: string): Promise<void> {
        await expectResponse(
            this.service.grant(user.info.userId, 
                { unit: "TestToken", policyId: this.testTokenPolicyId, quantity }),
            response =>
                response.status == "ok" ?
                success(unit) :
                failure(`Expected 'ok' from grant but got ${response}`)
        )
    }

    withNoAddresses(user: User): void {
        this.identityService.resolveUserReturns({ status: "ok", info: user.info })
    }

    withOnChainAssets(user: User, assets: { policyId: string, assetName: string, quantity: string }[] ): void {
        this.identityService.resolveUserReturns({ status: "ok", info: user.info })
        this.blockfrost.accountsAddressesAssetsReturns(assets.map(asset => {
            return {
                unit: asset.policyId+cardano.hexEncode(asset.assetName),
                quantity: asset.quantity
            }
        }))
    }

    async inventory(user: User): Promise<Inventory> {
        return await expectResponse(
            this.service.list(user.info.userId, { policies: [this.testTokenPolicyId] }),
            response =>
                response.status == "ok" ?
                success(response.inventory) :
                failure(`Expected 'ok' from list but got ${response}`)
        )
    }

    async claimTestToken(user: User, quantity?: string): Promise<TestClaim> {
        const testTokenPolicySigner = await Wallet.loadFromFiles("Preprod", 
            this.stubPath("policy-signer-payment.skey"), 
            this.stubPath("policy-signer-stake.skey"))
        const policy = testTokenPolicySigner.hashNativeScript().to_js_value()
        const stakeAddr = user.wallet.stakeAddress().to_address().to_bech32()
        this.secureSigningService.policyReturns({ status: "ok", policy })
        this.setClaimBlockfrostMocks()
        return await expectResponse(
            this.service.claim(user.info.userId, stakeAddr, 
                { unit: "TestToken", policyId: this.testTokenPolicyId, quantity}),
            response =>
                response.status == "ok" ?
                success({ claimId: response.claimId, tx: response.tx, policySigner: testTokenPolicySigner }) :
                failure(`Expected 'ok' from claim but got ${response}`)
        )
    }

    async signClaimAndSubmit(user: User, claim: TestClaim): Promise<string> {
        const policy = claim.policySigner.hashNativeScript()
        const transaction = Transaction.from_bytes(await cbor.decodeFirst(claim.tx))
        const claimerWitness = cbor.encode(user.wallet.signTx(transaction).to_bytes()).toString("hex")
        const policyWitness = cbor.encode(claim.policySigner.signWithPolicy(transaction, policy).to_bytes()).toString("hex")
        this.secureSigningService.signWithPolicyReturns({ status: "ok", witness: policyWitness })
        return await expectResponse(
            this.service.submitClaimSignature(claim.claimId, claim.tx, claimerWitness),
            response =>
                response.status == "ok" ?
                success(response.txId) :
                failure(`Expected 'ok' from claim but got ${JSON.stringify(response)}`)
        )
    }

    async checkClaimStatus(claim: { claimId: string, tx: string }): Promise<ClaimStatus> {
        return await expectResponse(
            this.service.claimStatus(claim.claimId),
            response =>
                response.status == "ok" ?
                success(response.claimStatus) :
                failure(`Expected 'ok' from claimStatus but got ${response}`)
        )
    }

    private setClaimBlockfrostMocks() {
        this.blockfrost.accountsAddressesReturns([{ address: "addr_test1qr50mcpmrfavg9ca0pd7mq3gc9uvqhr7gm78f346e2cc07l7u3q390npuc24v47udvsrr7h0t4d4m26h4f6gjpvw393sfwrk9j" }])
        this.blockfrost.blocksLatestReturs({
            time: 0,
            height: 0,
            hash: "",
            slot: 1,
            epoch: 0,
            epoch_slot: 0,
            slot_leader: "",
            size: 0,
            tx_count: 0,
            output: null,
            fees: null,
            block_vrf: "",
            op_cert: "",
            op_cert_counter: "",
            previous_block: "",
            next_block: null,
            confirmations: 0
        })
        this.blockfrost.addressesUtxosAllReturns([{
            "tx_hash": "f0b4f6b88b52f19441ea8bde5139d3696b576e74547a6f4d9215ccbb5c6335f0",
            "tx_index": 0,
            "output_index": 0,
            "amount": [
                {
                    "unit": "lovelace",
                    "quantity": "100000000"
                }
            ],
            "block": "963ad0029f73cd127afa2b03640a42f3e1f27da626ab09705e84f242fccde87b",
            "data_hash": null,
            "inline_datum": null,
            "reference_script_hash": null
        }])
        this.blockfrost.txSubmitReturns("a88aaa1b13e411d8d6b563e6396d0e8afbd07ee591ab88c4d796d6d63f778061")
        /*
        this.blockfrost.addressesUtxosAllReturns([])
        */
    }

    transactionIsInBlockchain(txId: string) {
        this.blockfrost.txsResponse({
            hash: txId,
            block: "",
            block_height: 0,
            block_time: 0,
            slot: 0,
            index: 0,
            output_amount: [{
                unit: "",
                quantity: "",
            }],
            fees: "",
            deposit: "",
            size: 0,
            invalid_before: "",
            invalid_hereafter: "",
            utxo_count: 0,
            withdrawal_count: 0,
            mir_cert_count: 0,
            delegation_count: 0,
            stake_cert_count: 0,
            pool_update_count: 0,
            pool_retire_count: 0,
            asset_mint_or_burn_count: 0,
            redeemer_count: 0,
            valid_contract: true
        })
    }

    private stubPath = (filename: string): string =>
        path.join(__dirname, "..", "..", "stubs", "test-keys", filename)
}
