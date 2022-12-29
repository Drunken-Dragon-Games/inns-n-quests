import dotenv from 'dotenv'

dotenv.config()

const corsOptions = {
    origin: process.env.CORS_ORIGIN as string,
    credentials: true
}

const PORT: number = 5000; // PORT FROM WHICH THE APP WILL BE SERVED

const SECRET_KEY: string = process.env.SECRET_KEY as string; // CHANGE IN PRODUCTION

const NFT_MOCK_URL: string = process.env.NFT_MOCK_URL as string;

const SPRITE_SITE: string = "https://d1f9hywwzs4bxo.cloudfront.net" // v0.2.0
const SPRITE_SCALE: number = 3;

const ADVENTURER_PIXELTILES = [ "PixelTile1", "PixelTile2", "PixelTile3", "PixelTile11",
    "PixelTile12", "PixelTile13", "PixelTile21", "PixelTile22", "PixelTile23", "PixelTile24",
    "PixelTile31", "PixelTile32", "PixelTile33", "PixelTile41", "PixelTile42", "PixelTile43",
    "PixelTile44", "PixelTile45", "PixelTile46", "PixelTile47", "PixelTile48", "PixelTile49",
    "PixelTile51", "PixelTile52", "PixelTile53", "PixelTile54", "PixelTile55", "PixelTile56",
    "PixelTile57", "PixelTile58", "PixelTile59", "PixelTile60", "PixelTile61" ]

/*********** DRAGON SILVER PARAMETERS **************/
const MAX_DS_PER_TX: number = 1000; // LIMIT OF DRAGON SILVER PER TRANSACTION
const TIME_BETWEEN_TX: number = 2; // TIME GAP BETWEEN TRANSACTIONS
const TIME_IN_MEMORY_FOR_REWARD: number = 60 // TIME IN WHICH AN ADDRESS STAYS IN MEMORY TO KEEP TRACK OF TRANSACTIONS
const TX_LIMIT: number = 20; // TRANSACTION LIMIT PER MINUTE
const TIME_BLOCKED: number = 86400 // TIME IN WHICH PLAYERS WOULD NOT BE ABLE TO CLAIM

const COOKIE_EXPIRACY: number = 18000000; // SET THE EXPIRACY OF THE JWT COOKIE

const XP_BALANCER: number = 1; // XP PARAMETER TO ADJUST HOW MUCH EXPERIENCE IS EARNED (PERCENTAGE)
const DS_BALANCER: number = 1; // DS PARAMETER TO ADJUST HOW MUCH DRAGON SILVER IS EARNED (PERCENTAGE)

const DS_DECIMAL: number = 1; // NUMBER TO BE MULTIPLIED TO GET WHOLE PRICES

/*********** DS CLAIM FEE PARAMETERS **************/
const FEE_ADDRESS: string = "addr_test1qzdrumnpk8gmmrje5338whcetqckp6mxuq2gyxt3tqng250wdu5ty3fdr3ernj6qy00lx5guswhcmtw4n687kgwqk73qedagq4";
const DD_FEE_AMOUNT: string = '1000000';

const TX_TTL: number = 60 * 5;

export {
    corsOptions,
    PORT,
    SECRET_KEY,
    NFT_MOCK_URL,
    ADVENTURER_PIXELTILES,
    MAX_DS_PER_TX,
    TIME_BETWEEN_TX,
    TIME_IN_MEMORY_FOR_REWARD,
    TX_LIMIT,
    TIME_BLOCKED,
    COOKIE_EXPIRACY,
    XP_BALANCER,
    DS_BALANCER,
    DS_DECIMAL,
    SPRITE_SITE,
    SPRITE_SCALE,
    FEE_ADDRESS,
    DD_FEE_AMOUNT,
    TX_TTL
}