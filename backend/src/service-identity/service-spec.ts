import { LoggingContext } from "../tools-tracing"
import * as models from "./models"

export interface IdentityService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    createSigNonce(address: string, logger?: LoggingContext): Promise<models.CreateNonceResult>

    createAuthTxState(userId: string, stakeAddress: string, txId: string, logger?: LoggingContext):Promise<models.CreateAuthStateResult>

    verifyAuthState(authStateId: string, tx: string, userId: string, logger?: LoggingContext): Promise<models.VerifyAuthStateResult>

    authenticate(credentials: models.Credentials, logger?: LoggingContext): Promise<models.AuthenticationResult>

    register(credentials: models.Credentials, logger?: LoggingContext): Promise<models.RegistrationResult>

    associate(userId: string, credentials: models.Credentials, logger?: LoggingContext): Promise<models.AssociationResult>

    cleanAssociationTx(userId: string, authStateId: string, logger?: LoggingContext): Promise<models.CleanAssociationTxResult>

    refresh(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<models.RefreshResult>

    listSessions(userId: string, logger?: LoggingContext): Promise<models.ListSessionsResult>

    signout(sessionId: string, logger?: LoggingContext): Promise<models.SignOutResult>

    resolveUser(info: { ctype: "user-id", userId: string } | { ctype: "nickname", nickname: string }, logger?: LoggingContext): Promise<models.ResolveUserResult>

    resolveUsers(userIds: string[], logger?: LoggingContext): Promise<models.UserInfo[]>

    resolveSession(sessionId: string, logger?: LoggingContext): Promise<models.ResolveSesionResult>

    updateUser(userId: string, info: { nickname: string }, logger?: LoggingContext): Promise<models.UpdateUserResult>
}
