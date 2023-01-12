import { Umzug, SequelizeStorage, MigrationMeta } from "umzug"
import path from "path";
import generateQuests from "./quest_generation";
import executeRequirementGeneration from "./random-requirements";
import addAdventurerClass from "./adventurer_class";
import addAdventurerRace from "./adventurer_race";
import { Sequelize } from "sequelize";
import { loadPlayerModel } from "../../../players/models/player_model";
import { loadAdventurerModel } from "../../../adventurers/models/adventurer_model";
import { loadQuestModel } from "../../../quests/models/quest_model";
import { loadEnrolledModel } from "../../../quests/models/enroll_model";
import { loadWarEffortModel } from "../../../war-effort/models/war_effort_model";
import { loadWarEffortQuestModel } from "../../../war-effort/models/war_effort_quest_model";
import { loadWarEffortFactionModel } from "../../../war-effort/models/war_effort_factions_model";
import { loadTakenQuestModel } from "../../../quests/models/taken_quest_model";
import { loadPlayerAssosiations } from "../../../players/models";
import { loadWarEffortAssosiations } from "../../../war-effort/models";
import { loadQuestAssosiations } from "../../../quests/models";
import { loadAdventurerAssosiations } from "../../../adventurers/models";

/**
 * Umzug object builder to execute Sequelize migrations programmatically
 */
// export const migrator = new Umzug({
//     migrations: { glob: path.join(__dirname, '..', 'migrations', '*.js') },
//     context: sequelize,
//     storage: new SequelizeStorage({ sequelize }),
//     logger: console
// })
const extension = process.env.NODE_ENV === 'production' ? 'js' : 'ts'

export const createMigrator = (database: Sequelize) => {
    console.log(path.join(__dirname, '..', 'migrations', '*.js'));
    
    const migrator = new Umzug({
        migrations: { glob: path.join(__dirname, '..', 'migrations', `*.${extension}`) },
        context: database,
        storage: new SequelizeStorage({ sequelize: database }),
        logger: console
    })

    return migrator
}

/**
 * Function to execute pending migrations
 * @return Nothing
 */
export const loadQuestModuleModels = async (database: Sequelize): Promise<void> => {
    try {
        loadPlayerModel(database)        
        loadAdventurerModel(database)
        loadTakenQuestModel(database)
        loadEnrolledModel(database) 
        loadQuestModel(database)        
        loadWarEffortModel(database)        
        loadWarEffortFactionModel(database)        
        loadWarEffortQuestModel(database)        
        loadPlayerAssosiations()
        loadAdventurerAssosiations()
        loadQuestAssosiations()
        loadWarEffortAssosiations()
        const migrator = createMigrator(database)   
        const migrations = await migrator.up()
        
        console.log("")        
        if(migrations.length > 0) console.log("Database Synchronized")
        else console.log("There are no new migrations")        
        await seedExecuter(database, migrations)
        
    } catch (error: any) {
        console.log(error)
        console.log("Error at the time of migrations") 
    }
}

/**
 * Execute scripts that will run like seeds to populate the db
 * with wanted data
 * @param migrations List of migrations to be inspected
 * @returns Nothing 
 */
const seedExecuter = async (database: Sequelize, migrations: MigrationMeta[]) => {
    for (const migration of migrations) {
        if (migration.name === `20220608155113-create-quests.${extension}`) await generateQuests(200)
        else if (migration.name === `20220805163635-add-quest-requirement.${extension}`) await executeRequirementGeneration(database)
        else if (migration.name === `20220805164319-add-adventurer-class.${extension}`) await addAdventurerClass(database)
        else if (migration.name === `20220810152042-add-adventurer-race.${extension}`) await addAdventurerRace(database) 
    }
}

export type Migration = (migrator: { context: Sequelize }) => Promise<void>