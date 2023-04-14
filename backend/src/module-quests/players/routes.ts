import {Router} from "express"
import { WellKnownPolicies } from "../../registry-policies.js";
import { AssetManagementService } from "../../service-asset-management/index.js";
import { IdentityService } from "../../service-identity/index.js";
import { 
    getAuthenticationNonce, 
    verifySignature,
    walletLogout,
    mintTestNft,
    signAndSubmitTx,
    checkTxStatus,
    getDragonSilverToClaim,
    claimDragonSilver,
    refreshToken
} from "./controller.js";


export const loadPlayerRoutes = (identityService: IdentityService, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => {
    const router = Router()
    router.post('/validate', getAuthenticationNonce(identityService))
    router.post('/validate/:nonce', verifySignature(identityService))
    router.post('/refresh/tokens', refreshToken(identityService))
    router.get('/logout', walletLogout)
    router.get('/vm/dragon-silver', getDragonSilverToClaim(assetManagementService, wellKnownPolicies))
    router.post('/mint-test-nft', mintTestNft(assetManagementService, wellKnownPolicies))
    router.post('/submit-tx', signAndSubmitTx(assetManagementService))
    router.post('/tx/status', checkTxStatus)
    router.post('/claim/dragon-silver', claimDragonSilver(assetManagementService, wellKnownPolicies))
    return router
}
