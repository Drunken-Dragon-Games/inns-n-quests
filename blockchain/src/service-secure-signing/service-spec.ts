import { Script, Transaction } from "https://deno.land/x/lucid@0.10.6/mod.ts";
import { Resolution } from "../utypes.ts";

export interface SecureSigningService {
    policy(policyId: string): Resolution<Script>
    signWithPolicy(policyId: string, transaction: Transaction): Promise<Resolution<string>> 
}
