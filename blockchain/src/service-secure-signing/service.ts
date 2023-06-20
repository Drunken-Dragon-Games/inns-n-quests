import { Lucid, Transaction } from "https://deno.land/x/lucid@0.10.6/mod.ts"
import Registry from "./registry/registry.ts"
import { SecureSigningService } from "./service-spec.ts"
import { stringOrError } from "../utils.ts"
import { Resolution } from "../utypes.ts";

export type SecureSigningServiceConfig = { 
    encryptionPassword: string, 
    initialRegistry: string,
    lucidFactory: () => Promise<Lucid>
}


export class SecureSigningServiceDsl implements SecureSigningService {

    constructor (private registry: Registry) {}

    static async loadFromConfig(salt: string, appConfig: SecureSigningServiceConfig): Promise<SecureSigningService> {
        const registry = new Registry(appConfig.lucidFactory, {salt, password: appConfig.encryptionPassword})

        if (appConfig.initialRegistry != undefined) {
            await registry.importCache(appConfig.initialRegistry)
            Object.keys(registry.getCache()).forEach(policyId => {console.log(`Loaded registry policy ${policyId}`)})
        }

        return new SecureSigningServiceDsl(registry)
    }

    static async loadFromEnv(salt: string, lucidFactory: () => Promise<Lucid>): Promise<SecureSigningService> {
        return SecureSigningServiceDsl.loadFromConfig(salt,
            { 
                encryptionPassword: await stringOrError("ENCRYPTION_PASSWORD"), 
                initialRegistry: await stringOrError("ENCRYPTED_REGISTRY"),
                lucidFactory
            })
    }

    async signWithPolicy(policyId: string, transaction: Transaction): Promise<Resolution<string>> {
        try {
            const response = await this.registry.signWithPolicy(policyId, transaction)
            if (!response) return {status: "invalid", reason: "could not sign with policy"}
            return {status: "ok", value: response}
        } catch (_) {
            return {status: "invalid", reason: "bad-tx"}
        }
    }

}
 