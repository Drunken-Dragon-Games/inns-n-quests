import dotenv from 'dotenv'
dotenv.config()

export const corsOptions = {
    origin: process.env.CORS_ORIGIN as string,
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
