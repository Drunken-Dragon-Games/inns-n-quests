import { BuildTxResponse } from "../../service-blockchain/models"
import { BlockchainService } from "../../service-blockchain/service-spec"

export default class BlockchainServiceMock {

    public readonly service: BlockchainService

    constructor() {
        this.service = {
            health:  jest.fn(),
            getWalletAuthenticationSelfTx:  jest.fn(),
            buildMintTx:  jest.fn(),
            getTxHashFromTransaction:  jest.fn(),
            submitTransaction:  jest.fn(),
            buildBulkMintTx: jest.fn(),
            buildAssetsSellTx: jest.fn()
        }
    }

    buildAssetsSellTxReturns(response: BuildTxResponse){
        return jest.spyOn(this.service, "buildAssetsSellTx")
            .mockReturnValueOnce(Promise.resolve(response))
    }
}