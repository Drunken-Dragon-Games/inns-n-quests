import { Adventurer, 
         IAdventurer, 
         IAdventurerData, 
         IAdventurerMetadata, 
         IAdventurerRes, 
         IDeadAdventurerData } from "./adventurer_model.js";
import { Player } from "../../players/models.js";
import { Enrolled } from "../../quests/models.js";

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