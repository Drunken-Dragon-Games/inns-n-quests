
export const schedulerWait = (millis: number): Promise<void> =>
    new Promise((resolve, _) => {
        setTimeout(() => { resolve() }, millis)
    })

export const retry: <A>(f: () => Promise<A>, options?: { maxRetries?: number, millis?: number }) => Promise<A> = 
    async (f, options) => {
        const maxRetries: number = options?.maxRetries ?? 10 
        const millis: number = options?.millis ?? 100
        try { return await f() }
        catch (e) {
            if (maxRetries <= 0) throw e 
            await schedulerWait(millis)
            return await retry(f, { maxRetries: maxRetries-1, millis }) 
        }
    }

export const retrySync: <A>(f: () => A, options?: { maxRetries?: number, millis?: number }) => A = 
    (f, options) => {
        const maxRetries: number = options?.maxRetries ?? 10 
        const millis: number = options?.millis ?? 100
        try { return f() }
        catch (e) {
            if (maxRetries <= 0) throw e 
            schedulerWait(millis)
            return retrySync(f, { maxRetries: maxRetries-1, millis }) 
        }
    }

export const retryBool: (f: () => Promise<boolean>, options?: { maxRetries?: number, millis?: number }) => Promise<boolean> = 
    async (f, options) => {
        const maxRetries: number = options?.maxRetries ?? 10 
        const millis: number = options?.millis ?? 100
        try { 
            const result = await f()
            if (result) return result
            else if (maxRetries <= 0) return false
            else return await retryBool(f, { maxRetries: maxRetries-1, millis }) 
        }
        catch (e) {
            if (maxRetries <= 0) return false
            await schedulerWait(millis)
            return await retryBool(f, { maxRetries: maxRetries-1, millis }) 
        }
    }

export const retryBoolSync: (f: () => boolean, options?: { maxRetries?: number, millis?: number }) => Promise<boolean> = 
    async (f, options) => {
        const maxRetries: number = options?.maxRetries ?? 10 
        const millis: number = options?.millis ?? 100
        try { 
            const result = f()
            if (result) return result
            else if (maxRetries <= 0) return false
            else return retryBoolSync(f, { maxRetries: maxRetries-1, millis }) 
        }
        catch (e) {
            if (maxRetries <= 0) return false
            await schedulerWait(millis)
            return retryBoolSync(f, { maxRetries: maxRetries-1, millis }) 
        }
    }
