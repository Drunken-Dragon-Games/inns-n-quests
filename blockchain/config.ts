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