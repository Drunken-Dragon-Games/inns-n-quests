import { BlockchainService, blockchainEnpoints, prefix } from "./service-spec"
import { config } from "../tools-utils"
import { AssosiationTxResponse, Endpoint, HealthStatus } from "./models"
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
        const response = await this.callImplementation(blockchainEnpoints.getWalletAuthenticationSelfTx, {address})
        return response.data as AssosiationTxResponse
    }

    private async callImplementation<ResData = any, ReqData = any>(endpoint: Endpoint, data?: ReqData): Promise<AxiosResponse<ResData>> {
        const baseURL = new URL(`deno/${prefix}`, this.baseURL).href

        return await axios.request<ResData, AxiosResponse<ResData>, ReqData>({
            method: endpoint.method,
            baseURL,
            url: endpoint.path,
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

