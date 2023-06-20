import { Resolution } from "../utypes.ts";

export interface SecureSigningService {
    signWithPolicy(policyId: string, transaction: string): Promise<Resolution<string>>
}
