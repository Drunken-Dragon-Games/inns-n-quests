import { WarEffort } from "./war_effort_model";
import { WarEffortFaction } from "./war_effort_factions_model";
import { WarEffortQuest } from "./war_effort_quest_model";
import { Quest } from "../../quests/models";

export const loadWarEffortAssosiations = () => {
    WarEffortQuest.belongsTo(Quest, {
        foreignKey: "quest_id"
    });
    
    WarEffort.hasMany(WarEffortFaction, {
        foreignKey: "war_effort_id",
        onDelete: "CASCADE"
    });
    
    WarEffort.hasMany(WarEffortQuest, {
        foreignKey: "war_effort_id",
        onDelete: "CASCADE"  
    });
    
    WarEffortFaction.belongsTo(WarEffort, {
        foreignKey: "war_effort_id"
    });
    
    WarEffortQuest.belongsTo(WarEffort, {
        foreignKey: "war_effort_id"
    });
    
    WarEffortFaction.hasMany(WarEffortQuest, {
        foreignKey: "faction_id",
        onDelete: "CASCADE"
    })
    
    WarEffortQuest.belongsTo(WarEffortFaction, {
        foreignKey: "faction_id"
    })
}

export {
    WarEffort,
    WarEffortQuest,
    WarEffortFaction
}