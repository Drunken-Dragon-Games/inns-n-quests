const corsOrigins = ["http://localhost:5000"]

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[]

export const corsOptions = {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => {
        if (corsOrigins.includes(requestOrigin ?? "") || !requestOrigin) callback(null, true)
        else callback(new Error(`Not allowed by CORS for ${requestOrigin} (allowed: ${corsOrigins})`))
    },
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept", "X-Requested-With", "Trace-ID"],
    credentials: true 
}

export const encryptionKey = "9d8a1876f66da8b25753ef4b82cab693"