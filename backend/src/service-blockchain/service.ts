import { BlockchainService, blockchainEnpoints, servicePrefix } from "./service-spec"
import { config } from "../tools-utils"
import { AssosiationTxResponse, Endpoint, HealthStatus, SubmitTransactionReponse, TransactionHashReponse } from "./models"
import axios, { AxiosResponse } from "axios"
import dotenv from "dotenv"

export type BlockchainServiceConfig = {
    baseURL: string
}

export class BlockchainServiceDsl implements BlockchainService {

    constructor(private baseURL: string){}

    static loadFromEnv(): BlockchainService {
        dotenv.config()
        return BlockchainServiceDsl.loadFromConfig({ baseURL: config.stringOrError("BLOCKCHAIN_SERVICE_URL")})
    }

    static loadFromConfig(servConfig: BlockchainServiceConfig): BlockchainService {
        //TODO: implmeent a class logger
        const service = new BlockchainServiceDsl(servConfig.baseURL)
        return service
    }

    async health(): Promise<HealthStatus> {
        const response = await this.callImplementation(blockchainEnpoints.health)
        return response.data as HealthStatus
    }

    async getWalletAuthenticationSelfTx(address: string): Promise<AssosiationTxResponse> {
        //TODO: test if error codes trigger an error and handle
        const response = await this.callImplementation(blockchainEnpoints.getWalletAuthenticationSelfTx, {address})
        return response.data as AssosiationTxResponse
    }

    async getTxHashFromTransaction(serilizedTransaction: string): Promise<TransactionHashReponse> {
        const response = await this.callImplementation(blockchainEnpoints.getTxHashFromTransaction, {serilizedTransaction})
        return response.data as TransactionHashReponse
    }

    async submitTransaction(serilizedTransaction: string): Promise<SubmitTransactionReponse> {
        const response = await this.callImplementation(blockchainEnpoints.getTxHashFromTransaction, {serilizedTransaction})
        return response.data as SubmitTransactionReponse
    }

    private async callImplementation<ResData = any, ReqData = any>(endpoint: Endpoint, data?: ReqData): Promise<AxiosResponse<ResData>> {
        const baseURL = new URL(`deno`, this.baseURL).href
        return await axios.request<ResData, AxiosResponse<ResData>, ReqData>({
            method: endpoint.method,
            baseURL,
            url: `${servicePrefix}${endpoint.path}`,
            data,
            headers: {
                "Content-Type": "application/json",
                accept: "application/json"
            },
            timeout: 5000,
            withCredentials: true,
        })
    }
}

