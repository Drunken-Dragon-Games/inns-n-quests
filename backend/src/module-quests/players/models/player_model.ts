import { DataTypes, Model, Optional, Sequelize, Transaction } from "sequelize"
import { createMintNftTx } from '../faucet.js'
import { LoggingContext } from "../../../tools-tracing.js"
import { AssetManagementService } from "../../../service-asset-management.js"
import { WellKnownPolicies } from "../../../registry-policies.js"

interface IPlayer {
    user_id: string
    war_effort_points: number
    addDs(amount: number, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies, logger: LoggingContext, transaction: Transaction): Promise<void>
    addWep(amount: number, transaction: Transaction): Promise<void>
    mintAsset(assetName: string, metadata: any): Promise<string>
    // Static: Method that creates a player
    // Method that generates cookie token
    // Method to get dragon silver
    // Method to get war effort points
    // Method to get Adventurers
    // Method to get taken quests
}

type IPlayerCreation = Optional<IPlayer, "war_effort_points">

class Player extends Model implements IPlayer {
    declare user_id: string;
    declare war_effort_points: number;

    /** Adds Dragon Silver to claim to this player
    * @param amount Number of DS tokens to add
    * @returns Nothing
    */
    async addDs(amount: number, assetManagementService: AssetManagementService, wellKnownPolicies: WellKnownPolicies, logger: LoggingContext): Promise<void> {
        // await this.update({ dragon_silver: this.dragon_silver + amount }, { transaction: transaction });
        const dragonSilverPolicy = wellKnownPolicies.dragonSilver.policyId
        if (dragonSilverPolicy == undefined) throw new Error("Dragon Silver policy id not found")
        const options = {
            unit: "DragonSilver",
            policyId: dragonSilverPolicy,
            quantity: amount.toString()
        }
        const amResponse = await assetManagementService.grant(this.user_id, options, logger)
        if (amResponse.status == "invalid") throw new Error("Dragon Silver grant could not be executed")
    }

    /** Mints Asset to the instance stake address
    * @param assetName Name of the asset to mint
    * @param metadata Metadata of the asset to mint in json format
    * @returns Unsigned tx in cbor format
    */
    async mintAsset(assetName: string, metadata: any): Promise<string> {
        let unsignedTx = await createMintNftTx(this.user_id, assetName, metadata);
        return unsignedTx;
    }

    /** Adds War Effort Points to this player
    * @param amount Number of DS tokens to add
    * @returns Nothing
    */
    async addWep(amount: number, transaction: Transaction): Promise<void> {
        await this.update({ war_effort_points: this.war_effort_points + amount }, { transaction: transaction }); 
    }

    /**
     * Creates a player with a given stake address
     * @param address 
     * @returns Player instance
     */
    static async findOrCreateInstance(userId: string): Promise<Player> {
        const [player, created] = await Player.findCreateFind({
            where: {
                user_id: userId
            }
        })
        return player
    }
}

export const loadPlayerModel = (sequelize: Sequelize) => {
    Player.init({
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        war_effort_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: "player",
        tableName: "players",
        timestamps: false
    })
}

export {
    Player,
    IPlayer
}