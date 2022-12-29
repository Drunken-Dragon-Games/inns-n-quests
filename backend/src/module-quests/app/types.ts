import { Model, ModelDefined } from "sequelize/types";
import { Request } from "express"

type IToken = {
    userId: string;
    sessionId: string;
    authType: string;
    expiration: number;
    stake_address?: string
}

interface IApiNFTs {
    pixeltiles: IWalletNFT[],
    gmas: IWalletNFT[]
    adv_of_thiolden: IWalletNFT[]
}

interface IWalletNFT {
    name: string,
    quantity: number
}

interface ISerializer<T extends {}, V extends {}>{
    model: ModelDefined<T, V>,
    fields: string[],
    data?: T | T[],
    validateInstance?(instance: object | Array<Model>, many: Boolean): Boolean,

}

interface AuthRequest extends Request {
    auth: IToken 
}

interface InMemoryTx {
    ds: number,
    times_claimed: number,
    is_blocked: boolean
}

interface IMonsterData {
    [key: string]: { 
        [key: string]: string[]
    }
}

interface IRarity {
    name: string,
    percentage: number,
    monsters: {
        [key: string]: string
    },
    xp_base_modifier: number,
    max_level_required: number,
    min_level_required: number,
    max_duration: number, 
    min_duration: number
}

interface INarrative {
    name: string,
    description: string,
    monster: string,
    rarity: string
}

interface IRewards {
    name: string,
    probability: number,
    min_reward: number,
    max_reward: number
}


interface ValidateAddress {
    stakeAddressLength: boolean,
    includesStringTest: boolean,
    hasSpecialChars?: boolean
}

interface IFilteredAdventurers {
        min_level: number,
        max_level: number,
        adventurer_count: number,
        average_level: number,
        difficulty_offset: number
}

interface IPixelTileMetaData {
    name: string,
    image: string,
    alt: string,
    rarity: string,
    type: string
}

interface IPixelTile {
    [key: string]: IPixelTileMetaData
}

interface IGMAMetadata {
    name: string,
    image: string,
    race: string,
    subrace: string,
    genre: string,
    class: string,
    armor: string,
    weapon: string
}

interface IGma {
    [key: string]: IGMAMetadata
}

interface Policy {
    [assetName: string]: string
}

export {
    IToken,
    IApiNFTs,
    IWalletNFT,
    ISerializer,
    AuthRequest,
    InMemoryTx,
    IRarity,
    IMonsterData,
    IRewards,
    INarrative,
    ValidateAddress,
    IFilteredAdventurers,
    IPixelTileMetaData,
    IGMAMetadata,
    IGma,
    IPixelTile,
    Policy
}