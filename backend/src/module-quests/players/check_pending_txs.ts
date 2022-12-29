// // import { ClaimedDragonSilver } from "./models";
// import { blockfrost } from "../blockfrost/intializer";
// import { TX_TTL } from "../app/settings";
// import { sequelize } from "../app/database/database";
// import { Player } from "./models";
// const { Op } = require("sequelize")

// //////////////// FUNCTION THAT CHECKS TX STATUS OF DS TO CLAIM ///////////////////
// /*
// QUERIES THE DB FOR EVERY TX THAT IS NOT COMPLETED OR FAILED
// QUERIES BLOCKFROST FOR EVERY TX
//  */
// const checkTxsStatus = async () => {    
//     const claims = await ClaimedDragonSilver.findAll({
//         where: {
//             state: {
//                 [Op.or]: [["submitted", "created"]]
//             }
//         }
//     })

//     // CHECKS THE STATUS OF SUBMMITED TX 
//     claims.forEach( async (claim) => {
//         if (claim.getDataValue("state") == "submitted") {
//             let tx;
//             try {                
//                 tx = await blockfrost.txs(claim.getDataValue("tx_id")!)
//             } catch (error) {
//                 console.log("Transaction not found");                
//             }
//             if (tx) {
//                 // CHANGE TO CONFIRMED IF TX WAS FOUND
//                 await claim.update({ state: "confirmed" })
//                 console.log("Transaction confirmed");
//             } 
//         }  
//         if (Date.parse(claim.getDataValue("created_at")!) + (TX_TTL * 1000) < Date.now() && 
//             claim.getDataValue("state") !== "confirmed") {
//             const player = await Player.findOne({
//                 where: {
//                     staking_address: claim.getDataValue("stake_address")
//                 }
//             })

//             // CHANGE TO TIMED OUT IF TX TTL EXPIRED
//             const t = await sequelize.transaction()
//             await claim.update({ 
//                 state: "timed_out" 
//             }, { 
//                 transaction: t
//             })
//             await Player.update({ 
//                 dragon_silver: player?.getDataValue("dragon_silver")! + claim.getDataValue("dragon_silver")
//             }, {
//                 where: {
//                     staking_address: claim.getDataValue("stake_address")
//                 },
//                 transaction: t
//             })
//             await t.commit()
//             console.log("Transaction timed out"); 
//         }
//     })
//     return
// }

// checkTxsStatus()