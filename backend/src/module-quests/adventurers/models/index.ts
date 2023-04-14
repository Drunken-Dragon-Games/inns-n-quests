import { Adventurer, 
         IAdventurer, 
         IAdventurerData, 
         IAdventurerMetadata, 
         IAdventurerRes, 
         IDeadAdventurerData } from "./adventurer_model.js";
import { Player } from "../../players/models/index.js";
import { Enrolled } from "../../quests/models/index.js";

export const loadAdventurerAssosiations = () => {
    Adventurer.belongsTo(Player, {
        foreignKey: "user_id"
    });
    
    Adventurer.hasOne(Enrolled, { 
        foreignKey: "adventurer_id",
        onDelete: "CASCADE"
    });
}

export { 
    Adventurer,
    IAdventurer,
    IAdventurerData,
    IAdventurerMetadata,
    IAdventurerRes,
    IDeadAdventurerData
}