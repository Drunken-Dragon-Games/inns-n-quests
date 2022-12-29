import { Player, IPlayer } from "./player_model";
// import { PlayerToVerify, IPlayerToVerify } from "./player_to_verify_model";
// import { ClaimedDragonSilver, IClaimedDragonSilver } from "./claimed_ds_model";
import { Adventurer } from "../../adventurers/models";
import { TakenQuest } from "../../quests/models";

// ClaimedDragonSilver.belongsTo(Player, {
//     foreignKey: "stake_address"
// });

// Player.hasMany(ClaimedDragonSilver, {
//     foreignKey: "stake_address",
//     onDelete: "CASCADE"
// });

export const loadPlayerAssosiations = () => {
    Player.hasMany(Adventurer, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
    });
    
    Player.hasMany(TakenQuest, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
    });
}

export {
    Player,
    // ClaimedDragonSilver,
    // PlayerToVerify,
    IPlayer,
    // IPlayerToVerify,
    // IClaimedDragonSilver
}