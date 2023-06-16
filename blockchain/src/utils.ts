import { load } from "https://deno.land/std@0.188.0/dotenv/mod.ts"
const env = await load()

export const stringOrError = <T extends string>(varKey: string): T => {
    const varVal = env[varKey] as T | undefined
    if (!varVal) throw new Error(`While configuring application, expected environment variable '${varKey}' (string) but was not set`);
    else return varVal
}
