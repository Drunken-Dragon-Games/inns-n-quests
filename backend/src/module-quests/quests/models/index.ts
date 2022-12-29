import { Quest, IQuest, IQuestCreation, IQuestRequirements, ICharacterRequirements } from "./quest_model";
import { Enrolled, IEnroll } from "./enroll_model";
import { TakenQuest, ITakenQuest, ITakenQuestCreation } from "./taken_quest_model";
import { Adventurer } from "../../adventurers/models";
import { Player } from "../../players/models";
import { WarEffortQuest } from "../../war-effort/models";


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