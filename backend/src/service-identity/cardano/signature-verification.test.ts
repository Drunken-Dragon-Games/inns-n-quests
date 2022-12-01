import { Wallet } from "../../tools-cardano"
import { success } from "../../tools-utils"
import { verifySig } from "./signature-verification"
import { SignatureVerificationState } from "./signature-verification-db"

test("Verify sig", async () => {
    const nonce = "nonce"
    const wallet = Wallet.generate("mainnet", "password")
    const stakeAddress = wallet.stakeAddress.to_address().to_bech32()
    SignatureVerificationState.findOne = jest.fn(async () => {
        return { 
            address: stakeAddress, 
            nonce: nonce, 
            destroy: () => Promise.resolve() 
        }
    })
    const { signature, key } = wallet.signData(nonce)
    const result = await verifySig(signature, nonce, key)
    expect(result).toStrictEqual(success(stakeAddress))
})
