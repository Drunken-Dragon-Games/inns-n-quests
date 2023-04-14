import { Router } from "express"
import { jwtMiddleware } from "../middleware/jwt_middleware.js"

import {
    addWallet,
    addDiscord,
    mergeAccounts,
    getAccountData,
    refreshSession
} from "../controllers/account_controller.js";
import { IdentityService } from "../../service-identity.js";


const loadAccountManagementRoutes = (identityService: IdentityService) => {
    const router = Router();
    router.post('/validateWallet/:nonce', jwtMiddleware, addWallet(identityService));
    router.post('/validateDiscord', jwtMiddleware, addDiscord(identityService));
    //TODO ask Fran about how to handle
    router.post('/mergeAccounts', jwtMiddleware, mergeAccounts)
    router.get('/accountData', jwtMiddleware, getAccountData(identityService))
    router.post('/refreshSession', refreshSession(identityService))
    return router
}
export default loadAccountManagementRoutes;