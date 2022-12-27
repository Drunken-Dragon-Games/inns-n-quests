import { Router } from "express"
import { jwtMiddleware } from "../middleware/jwt_middleware"
import {
    getInfo,
    logout,
    getDragonSilver,
    getAvailableProfilePicks,
    setNickName
} from "../controllers/user_controller";
import { IdentityService } from "../../service-identity";
import { AssetManagementService } from "../../service-asset-management";

const loadUserRoutes = (identityService: IdentityService, assetManagementService: AssetManagementService) => {
    const router = Router()
    router.get('/UserInfo', jwtMiddleware, getInfo(identityService, assetManagementService))
    router.get('/UserDragonSilver', jwtMiddleware, getDragonSilver(assetManagementService))
    router.get('/logout', jwtMiddleware, logout(identityService));
    router.get('/availablePicks', jwtMiddleware, getAvailableProfilePicks)
    router.post('/setNickName', jwtMiddleware, setNickName(identityService))
    return router
}

export default loadUserRoutes;