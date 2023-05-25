import dotenv from 'dotenv'
dotenv.config()

export const NODE_ENV = (process.env.NODE_ENV ?? "development") as string

const corsOrigins = typeof process.env.CORS_ORIGIN == "string" ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:3000"]

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[]

export const corsOptions = {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => {
        if (corsOrigins.includes(requestOrigin ?? "") || !requestOrigin) callback(null, true)
        else callback(new Error(`Not allowed by CORS for ${requestOrigin} (allowed: ${corsOrigins})`))
    },
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept", "X-Requested-With", "Trace-ID"],
    credentials: true 
}

export const envOrElse = (varKey: string, orElse: string): string => {
    const varVal = process.env[varKey]
    if (varVal === undefined)
        return orElse
    else
        return varVal
}

export const PORT: number = 5000; // PORT FROM WHICH THE APP WILL BE SERVED
export const SECRET_KEY: string = process.env.SECRET_KEY as string
export const COOKIE_EXPIRACY: number = 640000000; // SET THE EXPIRACY OF THE JWT COOKIE
export const SPRITE_SITE: string = "https://d1f9hywwzs4bxo.cloudfront.net" // v0.2.0
export const SPRITE_SCALE: number = 3;
export const IDENTITY_SERVICE_HOSTNAME = process.env.IDENTITY_SERVICE_HOSTNAME as string
export const ASSET_MANAGEMENT_SERVICE_HOSTNAME = process.env.ASSET_MANAGEMENT_SERVICE_HOSTNAME as string
