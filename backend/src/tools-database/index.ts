import fs from "fs"
import { Umzug, SequelizeStorage } from "umzug"
import { QueryInterface, Sequelize } from "sequelize";

export type DBConfig =
    { host: string
    , port: number
    , sslCertPath?: string
    , username: string
    , password: string
    , database: string
    }

export const connectToDB = (config: DBConfig): Sequelize =>
    new Sequelize(
        config.database,
        config.username,
        config.password,
        { dialect: "postgres"
        , host: config.host
        , port: config.port
        , logging: false
        , ssl: config.sslCertPath !== undefined
        , dialectOptions: 
            { bigNumberStrings: true
            , ssl: config.sslCertPath === undefined ? undefined :
                { require: true
                , ca: fs.readFileSync(config.sslCertPath)
                }
        }
    })

/**
 * Umzug object builder to execute Sequelize migrations programmatically
 */
export const buildMigrator = (sequelize: Sequelize, pathName: string): Umzug<QueryInterface> => 
    new Umzug({
        migrations: { glob: `${pathName}/*.{js,ts}` },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: undefined
    })