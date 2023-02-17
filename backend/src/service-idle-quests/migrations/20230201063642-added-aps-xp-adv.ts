import { QueryInterface } from 'sequelize'
import { AdventurerDBTableAttributes, AdventurerDBTableName } from '../items/adventurer-db'

type MigrationFun = (migrator: { context: QueryInterface }) => Promise<void>

export const up: MigrationFun = async ({ context: query }) => {
    try {
        await query.addColumn(AdventurerDBTableName, "athXP", AdventurerDBTableAttributes.athXP)
        await query.addColumn(AdventurerDBTableName, "intXP", AdventurerDBTableAttributes.intXP)
        await query.addColumn(AdventurerDBTableName, "chaXP", AdventurerDBTableAttributes.chaXP)
    } catch(_) {}
}

export const down: MigrationFun = async ({ context: query }) => {
    await query.removeColumn(AdventurerDBTableName, "athXP")
    await query.removeColumn(AdventurerDBTableName, "intXP")
    await query.removeColumn(AdventurerDBTableName, "chaXP")
}