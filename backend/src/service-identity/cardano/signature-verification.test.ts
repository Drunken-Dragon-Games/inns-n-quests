import { Wallet } from "../../tools-cardano/index.js"
import { success } from "../../tools-utils/index.js"
import { verifySig } from "./signature-verification.js"
import { SignatureVerificationState } from "./signature-verification-db.js"

test("Verify sig", async () => {
    const nonce = "nonce"
    const wallet = Wallet.generate("Mainnet", "password")
    const stakeAddress = wallet.stakeAddress().to_address().to_bech32()
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
