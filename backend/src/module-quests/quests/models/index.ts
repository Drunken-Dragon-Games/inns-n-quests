import { Quest, IQuest, IQuestCreation, IQuestRequirements, ICharacterRequirements } from "./quest_model.js";
import { Enrolled, IEnroll } from "./enroll_model.js";
import { TakenQuest, ITakenQuest, ITakenQuestCreation } from "./taken_quest_model.js";
import { Adventurer } from "../../adventurers/models.js";
import { Player } from "../../players/models.js";
import { WarEffortQuest } from "../../war-effort/models.js";


export const loadQuestAssosiations = () => {
    Quest.hasMany(TakenQuest, {
        foreignKey: "quest_id",
        onDelete: "CASCADE"
    });
    
    Quest.hasOne(WarEffortQuest, { 
        foreignKey: "quest_id",
        onDelete: "CASCADE"
    });
    
    TakenQuest.hasMany(Enrolled, { 
        foreignKey: "taken_quest_id",
        onDelete: "CASCADE" 
    });
    
    TakenQuest.belongsTo(Player, {
        foreignKey: "user_id",
    });
    
    TakenQuest.belongsTo(Quest, {
        foreignKey: "quest_id"
    });
    
    Enrolled.belongsTo(TakenQuest, { 
        foreignKey: "taken_quest_id"
    });
    
    Enrolled.belongsTo(Adventurer, { 
        foreignKey: "adventurer_id"
    });
}

export {
    Enrolled,
    TakenQuest,
    Quest,
    IEnroll,
    IQuest,
    IQuestCreation,
    IQuestRequirements,
    ITakenQuest,
    ITakenQuestCreation,
    ICharacterRequirements
}