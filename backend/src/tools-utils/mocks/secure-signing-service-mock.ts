import { SecureSigningService, PolicyResult, SignTxResult } from "../../service-secure-signing"

export default class SecureSigningServiceMock {

    public readonly service: SecureSigningService

    constructor() {
        this.service = {
            health: jest.fn(),
            policy: jest.fn(),
            signTx: jest.fn(),
            signWithPolicy: jest.fn(),
            signData: jest.fn(),
        }
    }

    policyReturns(response: PolicyResult) {
        return jest.spyOn(this.service, "policy")
            .mockReturnValueOnce(Promise.resolve(response))
    }

    signWithPolicyReturns(response: SignTxResult) {
        return jest.spyOn(this.service, "signWithPolicy")
            .mockReturnValueOnce(Promise.resolve(response))
    }
}
