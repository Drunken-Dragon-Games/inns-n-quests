import { IdentityService } from "../service-identity"
import * as idenser from "../service-identity"
import { AccountService, AuthenticateDiscordResult } from "./service-spec"
import { AssetManagementService } from "../service-asset-management"
import { onlyPolicies, WellKnownPolicies } from "../registry-policies"

export interface AccountServiceDependencies {
    identityService: IdentityService
    assetManagementService: AssetManagementService
    wellKnownPolicies: WellKnownPolicies
}

export class AccountServiceDsl implements AccountService {

    constructor (
        private readonly identityService: IdentityService,
        private readonly assetManagementService: AssetManagementService,
        private readonly wellKnownPolicies: WellKnownPolicies,
    ){}

    static async loadFromEnv(dependencies: AccountServiceDependencies): Promise<AccountService> {
        return await AccountServiceDsl.loadFromConfig(dependencies)
    }

    static async loadFromConfig(dependencies: AccountServiceDependencies): Promise<AccountService> {
        const service = new AccountServiceDsl(
            dependencies.identityService,
            dependencies.assetManagementService,
            dependencies.wellKnownPolicies,
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
    }

    async unloadDatabaseModels(): Promise<void> {
    }

    async authenticateDiscord(code: string): Promise<AuthenticateDiscordResult> {
        const credentials: idenser.Credentials = {ctype: "discord", deviceType: "Browser", authCode: code }
        const authResponse = await this.identityService.authenticate(credentials)
        if (authResponse.status != "ok") return authResponse
        const sessionResponse = await this.identityService.resolveSession(authResponse.tokens.session.sessionId)
        if (sessionResponse.status != "ok") return {status: "unknown-user"}
        const assetList = await this.assetManagementService.list(authResponse.tokens.session.userId, { policies: onlyPolicies(this.wellKnownPolicies) })
        if (assetList.status != "ok") return {status: "unknown-user"}
        const inventory = assetList.inventory
        const invDragonSilver = inventory[this.wellKnownPolicies.dragonSilver.policyId]
        const dragonSilver = parseInt(invDragonSilver?.find(a => a.chain)?.quantity ?? "0")
        const dragonSilverToClaim = parseInt(invDragonSilver?.find(a => !a.chain)?.quantity ?? "0")
        return {status: "ok", tokens: authResponse.tokens, inventory: {dragonSilver, dragonSilverToClaim}, info: sessionResponse.info}
    }
}