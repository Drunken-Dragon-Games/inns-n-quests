import { BlockchainService } from "../../service-blockchain/service-spec"

export default class BlockchainServiceMock {

    public readonly service: BlockchainService

    constructor() {
        this.service = {
            health:  jest.fn(),
            getWalletAuthenticationSelfTx:  jest.fn(),
            buildMintTx:  jest.fn(),
            getTxHashFromTransaction:  jest.fn(),
            submitTransaction:  jest.fn()
        }
    }
}