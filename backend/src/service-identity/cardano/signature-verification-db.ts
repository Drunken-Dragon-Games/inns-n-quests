
import { DataTypes, Model, Sequelize } from "sequelize"

export interface ISignatureVerificationState {
    address: string,
    nonce: string,
}

export class SignatureVerificationState extends Model implements ISignatureVerificationState {
    declare address: string
    declare nonce: string
}

export const SignatureVerificationStateTableName = "identity_signature_verification_states"

export const SignatureVerificationStateTableAttributes = {
    address: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    nonce: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

export class TransactionVerificationState extends Model{
    declare stateId: string
    declare userId: string
    declare stakeAddress: string
    declare txId: string
}

export const TransactionVerificationStateTableName = "identity_transaction_verification_states"

export const TransactionVerificationStateTableAttributes = {
    stateId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    stakeAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    txId: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    SignatureVerificationState.init(SignatureVerificationStateTableAttributes, {
        sequelize,
        modelName: "SignatureVerificationState",
        tableName: SignatureVerificationStateTableName
    })
}

export const configureSequelizeModelTransactionVerification = (sequelize: Sequelize): void => {
    TransactionVerificationState.init(TransactionVerificationStateTableAttributes, {
        sequelize,
        modelName: "TransactionVerificationState",
        tableName: TransactionVerificationStateTableName
    })
}