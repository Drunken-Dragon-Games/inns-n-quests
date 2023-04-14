import { Sequelize } from "sequelize"
import { createMigrator } from "./migrate.js"


/**
 * Function that uses umzug API to revert migrations
 * @param args List of arguments passed by the 'process.argv' currently only accepts the '--to' flag
 * @returns Nothing
 */ 
const undoMigrations = async (database: Sequelize, args: string[]) => {
    const migrator = createMigrator(database)
    const toIndex = args.indexOf('--to')
    const migrationName: string = args[toIndex + 1]

    if(migrationName == undefined) throw new Error("'To' argument is required")

    try {
        await migrator.down({ to: migrationName })
        console.log("Migrations successfully reverted")  
    } catch (error) {
        console.log(error);        
    }    
}