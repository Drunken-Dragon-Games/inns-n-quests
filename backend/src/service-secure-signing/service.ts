import cbor from "cbor"
import dotenv from "dotenv"
import { SecureSigningServiceLogging } from "./logging.js"
import { SecureSigningService } from "./service-spec.js"
import * as models from "./models.js"
import { Transaction } from "@emurgo/cardano-serialization-lib-nodejs"
import Registry from "./registry/registry.js"
import { LoggingContext } from "../tools-tracing/index.js"
import { CardanoNetwork, cardanoNetworkFromString } from "../tools-cardano/index.js"
import { config, HealthStatus } from "../tools-utils/index.js"
import { Lucid, C as LucidCore, TxComplete } from "lucid-cardano"

export interface SecureSigningServiceConfig
    { network: CardanoNetwork
    , encryptionPassword: string
    , initialRegistry: string
    }

export class SecureSigningServiceDsl implements SecureSigningService {

    constructor (private registry: Registry) {}

    static async loadFromEnv(salt: string, logger?: LoggingContext): Promise<SecureSigningService> {
        dotenv.config()
        return SecureSigningServiceDsl.loadFromConfig(salt,
            { network: cardanoNetworkFromString(config.stringOrElse("CARDANO_NETWORK", "Preprod"))
            , encryptionPassword: config.stringOrError("ENCRYPTION_PASSWORD")
            , initialRegistry: config.stringOrError("ENCRYPTED_REGISTRY")
            }, logger)
    }

    static async loadFromConfig(salt: string, appConfig: SecureSigningServiceConfig, logger?: LoggingContext): Promise<SecureSigningService> {
        const registry = new Registry(
            appConfig.network,
            { salt, password: appConfig.encryptionPassword }
        )
        if (appConfig.initialRegistry != undefined) {
            await registry.importCache(appConfig.initialRegistry)
            Object.keys(registry.getCache()).forEach(policyId => {
                logger?.info(`Loaded registry policy ${policyId}`)
            })
        }
        return new SecureSigningServiceLogging(new SecureSigningServiceDsl(registry))
    }

    async health(logger?: LoggingContext): Promise<HealthStatus> {
        return {
            status: "ok",
            dependencies: []
        }
    }

    public async policy(policyId: string, logger?: LoggingContext): Promise<models.PolicyResult> {
        const response = this.registry.policy(policyId)
        if (response == null) return { status: "unknown-policy" }
        else return { status: "ok", policy: response }
    }

    public async signTx(policyId: string, transaction: string, logger?: LoggingContext): Promise<models.SignTxResult> {
        try {
            const tx = Transaction.from_bytes(await cbor.decodeFirst(transaction))
            const response = this.registry.signTx(policyId, tx)
            if (response == null) return { status: "forbidden" }
            else {
                const encoded = cbor.encode(response.to_bytes()).toString("hex")
                return { status: "ok", witness: encoded }
            }
        } catch (_) {
            return { status: "bad-tx" }
        }
    }

    public async signWithPolicy(policyId: string, transaction: string, logger?: LoggingContext): Promise<models.SignTxResult> {
        try {
            const tx = Transaction.from_bytes(Buffer.from(transaction, "hex"))
            // const tx = Transaction.from_bytes(await cbor.decodeFirst(transaction))
            const response = this.registry.signWithPolicy(policyId, tx)
            if (response == null) return { status: "forbidden" }
            else {
                const encoded = cbor.encode(response.to_bytes()).toString("hex")
                return { status: "ok", witness: encoded }
            }
        } catch (_) {
            return { status: "bad-tx" }
        }
    }

    public async signData(policyId: string, payload: string, logger?: LoggingContext): Promise<models.SignDataResult> {
        try {
            const response = this.registry.signData(policyId, payload)
            if (response == null) return { status: "forbidden" }
            else return { status: "ok", payload: response }
        } catch (_) {
            return { status: "bad-tx" }
        }
    }

    public async lucidSignTx(policyId: string, transaction: TxComplete, logger?: LoggingContext): Promise<models.SignTxResult> {
        const response = await this.registry.lucidSignTx(policyId, transaction)
        if (response == null) return { status: "forbidden" }
        return { status: "ok", witness: response }
    }
}
