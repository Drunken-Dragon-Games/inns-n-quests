import { DataTypes, Model, Sequelize } from "sequelize"
export const BallotTableName = "ballots"
export class Ballot extends Model {
    declare ballotId: string
    declare inquiry: string
    declare state: "open"|"closed" | "archived"

    /**
     * `optionsArray` is a workaround to store arrays of strings since Sequelize
     * doesn't support them natively in all databases. It handles JSON
     * serialization/deserialization.
     */
    get optionsArray(): string[] {
        return JSON.parse(this.getDataValue('options'));
    }

    set optionsArray(value: string[]) {
        this.setDataValue('options', JSON.stringify(value));
    }
}

export const BallotTableAttributes = {
    ballotId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    inquiry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "open",
        validate: {
            isIn: [["open", "closed", "archived"]]
        }
    },
    options: {
        type: DataTypes.TEXT,
        allowNull: false,
        options: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    
}

export const BallotVotesTableName = "ballot_votes"
//CHECKME: depending on the DragonGold 0's handling it may be best to hanlde as a string and we parse to BigInt on use
export class BallotVote extends Model {
    declare voteId: string
    declare userId: string
    declare ballotId: string
    declare optionIndex: number
    declare dragonGold: number
}

export const BallotVoteTableAttributes = {
    voteId: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
    },
    //since they are ment to be diff services DBs i dont think its best to add the Reference
    //but i'll leave this here just in case
    /* userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserTableName,
            key: 'userId'
        },
    }, */
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    ballotId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: BallotTableName,
            key: 'ballotId',
        },
    },
    optionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dragonGold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    Ballot.init(BallotTableAttributes, {
        sequelize,
        modelName: "Ballot",
        tableName: BallotTableName
    })

    BallotVote.init(BallotVoteTableAttributes, {
        sequelize, 
        modelName: 'BallotVote', 
        tableName: BallotVotesTableName
    })

    Ballot.hasMany(BallotVote, {
        foreignKey: "ballotId",
        onDelete: "CASCADE"
    })

    BallotVote.belongsTo(Ballot, {
        foreignKey: "ballotId"
    })
}

