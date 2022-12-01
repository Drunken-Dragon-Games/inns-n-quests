
import { DataTypes, Model, Sequelize } from "sequelize"

export interface ISignatureVerificationState {
    address: string,
    nonce: string,
}

export class SignatureVerificationState extends Model implements ISignatureVerificationState {
    declare address: string
    declare nonce: string
}

export const SignatureVerificationStateTableName = "signature_verification_states"

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

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    SignatureVerificationState.init(SignatureVerificationStateTableAttributes, {
        sequelize,
        modelName: "SignatureVerificationState",
        tableName: SignatureVerificationStateTableName
    })
}