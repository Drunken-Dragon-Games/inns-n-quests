import { dotenv } from "../deps.ts"

export const stringOrError = async <T extends string>(varKey: string): Promise<T> => {
    const env = await dotenv.load()
    const varVal = env[varKey] as T | undefined
    if (!varVal) throw new Error(`While configuring application, expected environment variable '${varKey}' (string) but was not set`)
    else return varVal
}
