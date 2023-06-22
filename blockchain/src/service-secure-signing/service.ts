import { Lucid, Script, Transaction } from "https://deno.land/x/lucid@0.10.6/mod.ts"
import Registry from "./registry/registry.ts"
import { SecureSigningService } from "./service-spec.ts"
import { stringOrError } from "../utils.ts"
import { Resolution } from "../utypes.ts";
import { AES256 } from "./registry/aes256.ts";

export type SecureSigningServiceConfig = { 
    initialRegistry: string,
    lucidFactory: () => Promise<Lucid>
}


export class SecureSigningServiceDsl implements SecureSigningService {

    constructor (private registry: Registry) {}

    static async loadFromConfig( aes256: AES256, appConfig: SecureSigningServiceConfig): Promise<SecureSigningService> {
        const registry = new Registry(appConfig.lucidFactory, aes256)

        if (appConfig.initialRegistry != undefined) {
            await registry.importCache(appConfig.initialRegistry)
            Object.keys(registry.getCache()).forEach(policyId => {console.log(`Loaded registry policy ${policyId}`)})
        }

        return new SecureSigningServiceDsl(registry)
    }

    static async loadFromEnv(aes256: AES256, lucidFactory: () => Promise<Lucid>): Promise<SecureSigningService> {
        return SecureSigningServiceDsl.loadFromConfig(aes256,
            { 
                initialRegistry: await stringOrError("ENCRYPTED_REGISTRY"),
                lucidFactory
            })
    }

    policy(policyId: string): Resolution<Script> {
        return this.registry.policy(policyId)
    }

    async signWithPolicy(policyId: string, transaction: Transaction): Promise<Resolution<string>> {
        try {
            const response = await this.registry.signWithPolicy(policyId, transaction)
            if (response.status !== "ok") return {status: "invalid", reason: `could not sign with policy reason: ${response.reason}`}
            return response
        } catch (_) {
            return {status: "invalid", reason: "bad-tx"}
        }
    }

}
 