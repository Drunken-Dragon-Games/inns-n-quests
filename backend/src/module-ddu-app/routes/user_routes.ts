import { Router } from "express"
import { jwtMiddleware } from "../middleware/jwt_middleware"
import {
    getInfo,
    logout,
    getDragonSilver,
    getAvailableProfilePicks,
    setNickName,
    claimDragonSilver
} from "../controllers/user_controller";
import { IdentityService } from "../../service-identity";
import { AssetManagementService } from "../../service-asset-management";
import { WellKnownPolicies } from "../../registry-policies";

const loadUserRoutes = (identityService: IdentityService, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => {
    const router = Router()
    router.get('/UserInfo', jwtMiddleware, getInfo(identityService, assetManagementService, wellKnownPolicies))
    router.get('/UserDragonSilver', jwtMiddleware, getDragonSilver(assetManagementService, wellKnownPolicies))
    router.get('/logout', jwtMiddleware, logout(identityService));
    router.get('/availablePicks', jwtMiddleware, getAvailableProfilePicks)
    router.post('/setNickName', jwtMiddleware, setNickName(identityService))
    router.post('/claimDS', jwtMiddleware, claimDragonSilver(assetManagementService, wellKnownPolicies))
    return router
}

export default loadUserRoutes;