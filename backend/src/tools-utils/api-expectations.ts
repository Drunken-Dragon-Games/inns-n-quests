import { Result } from "./utypes";

export const fail = <A>(message: string): A => {
    try { throw new Error(message) }
    catch (e: any) { Error.captureStackTrace(e, fail); throw e }
}

export const requestShould = async <A, B>(options: { request: Promise<A>, response: (a: A) => Result<B, string> }): Promise<B> => {
    const r = await options.request
    const result = options.response(r)
    if (result.ctype === "failure") {
        try { return fail(result.error) }
        catch (e: any) { Error.captureStackTrace(e, requestShould); throw e }
    }
    else return result.result
}

export const expectResponse = async <A, B>(asyncResponse: Promise<A>, map: (a: A) => Result<B, string>): Promise<B> => {
    const response = await asyncResponse
    const result = map(response)
    if (result.ctype === "failure") {
        try { return fail(result.error) }
        catch (e: any) { Error.captureStackTrace(e, expectResponse); throw e }
    }
    else return result.result
}