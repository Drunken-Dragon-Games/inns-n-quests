// import { DataTypes, Model } from "sequelize"
// import { sequelize } from '../../app/database/database.js'
// import { WhereOptions } from "sequelize";
// var crypto = require("crypto");

// interface IPlayerToVerify {
//     stake_address: string,
//     nonce: string, 
// }

// class PlayerToVerify extends Model implements IPlayerToVerify {
//     declare stake_address: string
//     declare nonce: string

//     /**
//      * Method to find a PlayerToVerify instance based on stake adress
//      * @param stakeAddress Cardano Stake Address to be used at the time of signing up a player
//      * @returns PlayerToVerify instance or null if nothing was found
//      */
//     static async find(fieldOptions: WhereOptions): Promise<PlayerToVerify | null> {
//         const playerToVerify = await PlayerToVerify.findOne({
//             where: fieldOptions
//         });
//         return playerToVerify;
//     }

//     /** Method to generate a 20 character length string
//      * @returns Nonce to create player to verify
//      */
//     static createNonce(): string {
//         const nonce = crypto.randomBytes(20).toString('hex');
//         return nonce
//     }

//     /**
//      * Method to Create an instance or updates its nonce at the time of logging in
//      * @param stakeAddress Cardano Stake Address to be used at the time of signing up a player
//      * @returns New or updated PlayerToVerify instance and a boolean value that means if the player existed or not
//      */
//     static async createOrUpdate(stakeAddress: string): Promise<[PlayerToVerify, boolean]> {
//         const playerToVerify = await PlayerToVerify.find({ stake_address: stakeAddress })
//         const nonce = this.createNonce()
//         if(!playerToVerify) {
//             const newPlayerToVerify = await PlayerToVerify.create({
//                 stake_address: stakeAddress,
//                 nonce: nonce
//             })
//             return [newPlayerToVerify, false]
//         }
//         const updatedPlayerToVerify = await playerToVerify.update({
//             nonce: nonce
//         })

//         return [updatedPlayerToVerify, true]
//     }
// }

// PlayerToVerify.init({
//     stake_address: {
//         type: DataTypes.STRING,
//         unique: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     nonce: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     sequelize,
//     modelName: "player_to_verify",
//     tableName: "players_to_verify",
//     timestamps: false
// })

// export {
//     PlayerToVerify,
//     IPlayerToVerify
// }