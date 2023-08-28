import { dotenv } from "./deps.ts"

export const stringOrError = async <T extends string>(varKey: string): Promise<T> => {
    const env = await dotenv.load()
    const varVal = (Deno.env.get(varKey) as T | undefined) ?? env[varKey] as T | undefined
    if (!varVal) throw new Error(`While configuring application, expected environment variable '${varKey}' (string) but was not set`)
    else return varVal
}

export const exists = async (path: string): Promise<boolean> => {
    try {
        await Deno.stat(path)
        // successful, file or directory must exist
        return true
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            // file or directory does not exist
            return false
        } else {
            // unexpected error, maybe permissions, pass it along
            throw error
        }
    }
}