import { Lucid } from "../../deps.ts"
import { Resolution } from "../utypes.ts"

export interface SecureSigningService {
    policy(policyId: string): Resolution<Lucid.Script>
    signWithPolicy(policyId: string, transaction: Lucid.Transaction): Promise<Resolution<string>> 
}
