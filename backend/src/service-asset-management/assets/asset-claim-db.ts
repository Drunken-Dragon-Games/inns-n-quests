import { DataTypes, Model, Sequelize } from "sequelize"

export interface IAssetClaim {
    claimId: string,
    userId: string,
    policyId: string,
    unit: string,
    quantity: string,
    state: "created" | "submitted" | "confirmed" | "timed-out",
    txHash: string,
    txId?: string,
    createdAt: string
}

export class AssetClaim extends Model implements IAssetClaim {
    declare claimId: string
    declare userId: string
    declare policyId: string
    declare unit: string
    declare quantity: string 
    declare state: "created" | "submitted" | "confirmed" | "timed-out"
    declare txHash: string
    declare txId?: string
    declare createdAt: string
}

export const AssetClaimTableName = "asset_claim"

export const AssetClaimTableAttributes = {
    claimId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    policyId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "created",
        validate: {
            isIn: [["created", "submitted", "confirmed", "timed-out"]]
        }
    },
    txHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    txId: {
        type: DataTypes.STRING,
        allowNull: true
    },
}


export const configureSequelizeModel = (sequelize: Sequelize): void => {
    AssetClaim.init(AssetClaimTableAttributes, {
        sequelize, 
        modelName: 'AssetClaim', 
        tableName: AssetClaimTableName
    })
}
