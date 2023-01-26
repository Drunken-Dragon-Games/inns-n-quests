import {Router} from "express"
import { AssetManagementService } from "../../service-asset-management";
import { IdentityService } from "../../service-identity";
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
} from "./controller";


export const loadPlayerRoutes = (identityService: IdentityService, assetManagementService: AssetManagementService) => {
    const router = Router()
    router.post('/validate', getAuthenticationNonce(identityService))
    router.post('/validate/:nonce', verifySignature(identityService))
    router.post('/refresh/tokens', refreshToken(identityService))
    router.get('/logout', walletLogout)
    router.get('/vm/dragon-silver', getDragonSilverToClaim(assetManagementService))
    router.post('/mint-test-nft', mintTestNft(assetManagementService))
    router.post('/submit-tx', signAndSubmitTx(assetManagementService))
    router.post('/tx/status', checkTxStatus)
    router.post('/claim/dragon-silver', claimDragonSilver(assetManagementService))
    return router
}
