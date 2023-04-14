import { Router } from "express"
import { jwtMiddleware } from "../middleware/jwt_middleware.js"
import {
    getInfo,
    logout,
    getDragonSilver,
    getAvailableProfilePicks,
    setNickName,
    claimDragonSilver
} from "../controllers/user_controller.js";
import { IdentityService } from "../../service-identity/index.js";
import { AssetManagementService } from "../../service-asset-management/index.js";
import { WellKnownPolicies } from "../../registry-policies.js";

const loadUserRoutes = (identityService: IdentityService, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies) => {
    const router = Router()
    router.get('/UserInfo', jwtMiddleware, getInfo(identityService, assetManagementService, wellKnownPolicies))
    router.get('/UserDragonSilver', jwtMiddleware, getDragonSilver(assetManagementService, wellKnownPolicies))
    router.get('/logout', jwtMiddleware, logout(identityService));
    router.get('/availablePicks', jwtMiddleware, getAvailableProfilePicks)
    router.post('/setNickName', jwtMiddleware, setNickName(identityService))
    return router
}

export default loadUserRoutes;