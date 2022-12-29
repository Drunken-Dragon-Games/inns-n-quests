import { Adventurer, 
         IAdventurer, 
         IAdventurerData, 
         IAdventurerMetadata, 
         IAdventurerRes, 
         IDeadAdventurerData } from "./adventurer_model";
import { Player } from "../../players/models";
import { Enrolled } from "../../quests/models";

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