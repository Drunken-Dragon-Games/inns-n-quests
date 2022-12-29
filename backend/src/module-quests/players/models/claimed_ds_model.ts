// import { DataTypes, Model } from "sequelize"
// import { sequelize } from "../../app/database/database"
// import { Player } from "./player_model"

// interface IClaimedDragonSilver {
//     stake_address: string,
//     dragon_silver: number,
//     state: string,
//     tx_hash: string,
//     tx_id?: string,
//     created_at?: string
// }

// class ClaimedDragonSilver extends Model implements IClaimedDragonSilver {
//     declare stake_address: string
//     declare dragon_silver: number
//     declare state: string
//     declare tx_hash: string
//     declare tx_id?: string | undefined
//     declare created_at?: string | undefined
// }

// ClaimedDragonSilver.init({
//     id: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4
//     },
//     stake_address:{
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: Player,
//             key: "user_id"
//         }
//     },
//     dragon_silver: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     state: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             isIn: [["created", "submitted", "confirmed", "timed_out"]]
//         }
//     },
//     tx_hash: {
//         type: DataTypes.BLOB,
//         allowNull: false
//     },
//     tx_id: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     created_at: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         allowNull: false
//     }
// }, {
//     sequelize,
//     modelName: "claimed_ds",
//     tableName: "claimed_dragon_silver",
//     timestamps: false
// })

// export {
//     ClaimedDragonSilver,
//     IClaimedDragonSilver
// }