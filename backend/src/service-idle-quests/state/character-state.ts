import { DataTypes, Model, Op, QueryTypes, Sequelize, Transaction } from "sequelize"
import * as am from "../../service-asset-management"
import * as vm from "../game-vm"
import { newAPS } from "../game-vm"
import { Character } from "../models"
import { syncData } from "./sync-util"
import { TakenStakingQuestDB } from "./taken-staking-quest-state"

export type ICharacterDB = Omit<
    vm.CharacterEntity & 
    vm.WithOwner & 
    vm.WithActivityState, 
    "entityType" | 
    "characterType" | 
    "collection" | 
    "race" | 
    "class"
>

export class CharacterDB extends Model implements ICharacterDB {
    declare entityId: string
    declare userId: string
    declare assetRef: string
    declare name: string
    declare inActivity: boolean
    declare hp: number
    declare ivAPS: vm.APS
    declare xpAPS: vm.APS
}

export const CharacterDBInfo = {

    tableName: "idle_quests_characters",

    tableAttributes: {
        entityId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        assetRef: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inActivity: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        ivAPS: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        xpAPS: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    },

    configureSequelizeModel(sequelize: Sequelize): void {
        CharacterDB.init(this.tableAttributes, {
            sequelize,
            modelName: 'CharacterDB',
            tableName: this.tableName
        })
    }
}

type InventoryCharacter = {
    assetRef: string
    collection: vm.CharacterCollection
    quantity: number
}

export class CharacterState {

    constructor(
        private readonly objectBuilder: vm.IQMeatadataObjectBuilder,
    ) { }

    /**
     * Returns adventurer data only if they belong to the user.
     * 
     * @param userId 
     * @param entityIds 
     * @param transaction 
     * @returns 
     */
    async find(entityIds: string[], userId?: string, transaction?: Transaction): Promise<Character[]> {
        const characters = await CharacterDB.findAll({ where: { entityId: entityIds, userId }, transaction })
        return characters.map(makeCharacter(this.objectBuilder))
    }

    /**
     * Bulk creates characters and adds them to the user's inventory.
     * The assetRef and collection must be valid.
     * 
     * @param userId 
     * @param toCreate 
     * @returns 
     */
    async bulkCreate(userId: string, toCreate: InventoryCharacter[], transaction?: Transaction): Promise<Character[]> {
        if (toCreate.length == 0) return []
        const created: CharacterDB[] = await CharacterDB.bulkCreate(toCreate.flatMap(character =>
            [...Array(character.quantity)].map(() => makeCharacterDB(this.objectBuilder)(userId, character))
        ), { transaction })
        return created.map(makeCharacter(this.objectBuilder))
    }

    /**
     * Deletes characters from the database without any checks.
     * 
     * @param adventurersIds 
     * @returns 
     */
    async bulkDelete(entityIds: string[], transaction?: Transaction): Promise<void> {
        if (entityIds.length == 0) return
        await CharacterDB.destroy({ where: { entityId: entityIds }, transaction })
    }

    /**
     * Syncs the user's current inventory characters with the asset inventory.
     * The asset inventory comes from querying the Asset Management Service, and is a list of all the assets the user owns, in-chain or off-chain.
     * 
     * @param userId 
     * @param assetInventory 
     * @returns 
     */
    async syncCharacters(userId: string, assetInventory: am.Inventory, transaction?: Transaction): Promise<Character[]> {
        ///this takes in the full on chain and of chain inventory
        //returns an array of {assetRef: unit, collection: vm.CharacterCollection, quantity}
        const pickInventoryCharacters = (): InventoryCharacter[] => {
            const pxs: InventoryCharacter[] = (assetInventory[this.objectBuilder.wellKnownPolicies.pixelTiles.policyId] ?? [])
                .filter(pxt => 
                    this.objectBuilder.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Adventurer" ||
                    this.objectBuilder.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Monster" ||
                    this.objectBuilder.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Townsfolk" || 
                    this.objectBuilder.metadataRegistry.pixelTilesMetadata[pxt.unit].name == "PixelTile #24 Guard" ||
                    this.objectBuilder.metadataRegistry.pixelTilesMetadata[pxt.unit].name == "PixelTile #45 Recruit"
                )
                .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))

            const gmas: InventoryCharacter[] = (assetInventory[this.objectBuilder.wellKnownPolicies.grandMasterAdventurers.policyId] ?? [])
                .map(gma => ({ assetRef: gma.unit, collection: "grandmaster-adventurers", quantity: parseInt(gma.quantity) }))

            const aots: InventoryCharacter[] = (assetInventory[this.objectBuilder.wellKnownPolicies.adventurersOfThiolden.policyId] ?? [])
                .map(aot => ({ assetRef: aot.unit, collection: "adventurers-of-thiolden", quantity: parseInt(aot.quantity) }))

            return [...pxs, ...gmas, ...aots]
        }

        const preSyncedAdventurers: ICharacterDB[] = (await CharacterDB.findAll({ where: { userId } })).map(makeCharacter(this.objectBuilder))
        const assetInventoryAdventurers = pickInventoryCharacters()
        const { toCreate, toDelete, surviving } = syncData(preSyncedAdventurers, assetInventoryAdventurers)
        const createdAdventurers = await this.bulkCreate(userId, toCreate, transaction)
        await this.bulkDelete(toDelete.map(c => c.entityId), transaction)
        return createdAdventurers.concat(surviving.map(makeCharacter(this.objectBuilder)))
    }

    /**
     * Sets the inActivity flag to true for the given characters if they are not in a challenge already,
     * if their hp is not 0, and if they belong to the given user.
     * If for a given adventurer the inActivity flag is already true, or if the other conditions are not met, 
     * the adventurer is not updated, but the other characters are.
     * 
     * @param userId 
     * @param entityIds 
     * @param transaction 
     * @returns 
     */
    async setInActivity(userId: string, entityIds: string[], transaction?: Transaction): Promise<Character[]> {
        if (entityIds.length == 0) return []
        const [_, adventurers] = await CharacterDB.update({ inActivity: true }, 
            { where: { userId, entityId: entityIds, inActivity: false, hp: { [Op.not]: 0 } }, returning: true, transaction })
        return adventurers.map(makeCharacter(this.objectBuilder))
    }

    /**
     * Sets the inActivity flag to false for the given characters if they are in a challenge and belong to the given user.
     * If for a given adventurer the inActivity flag is already false, or if the other conditions are not met, 
     * the adventurer is not updated, but the other characters are.
     * 
     * @param userId 
     * @param entityIds 
     * @param transaction 
     * @returns 
     */
    async unsetInChallenge(userId: string, entityIds: string[], transaction?: Transaction): Promise<Character[]> { 
        if (entityIds.length == 0) return []
        const [_, adventurers] = await CharacterDB.update({ inActivity: false }, 
            { where: { userId, entityId: entityIds }, returning: true, transaction })
        return adventurers.map(makeCharacter(this.objectBuilder))
    }

    private async updateIfNotOnMission(entityId: string, userId: string, asset: {ctype: "ref", assetRef: string} | {ctype: "id", assetId: string}, database: Sequelize): Promise<{status: "ok"} | {status: "failed", reason: string}> {
        const [results, metadata] = await database.query(
            'SELECT * FROM "idle_quests_staking_taken_quests" WHERE "partyIds" @> ARRAY[:entityId]::uuid[] AND "claimedAt" IS NULL AND "outcome" IS NULL',
            { replacements: { entityId }, type: QueryTypes.SELECT })
    
        if (results) {
            return {status: "failed", reason: `Character is in staking quest ${JSON.stringify(results, null, 4)}`}
        } else {
            let whereClause = asset.ctype === "ref" ? { userId, assetRef: asset.assetRef } : { userId, entityId}
            await CharacterDB.update({ inActivity: false }, { where: whereClause })
            return { status: 'ok' }
        }
    }
    
    /**
     * For admin use through kilia Dev
     * Forces state on Asset if userId owns exaclty one matching AsssetRef, 
     * this is ment to help with interaction from the outside world
     * this was implemented in repsonse to: https://github.com/Drunken-Dragon-Games/inns-n-quests/issues/68
     * 
     * @param userId 
     * @param assetRef 
     * @param act 
     * @returns 
     */
    async normalizeAssetStatus(userId: string, asset:{ctype: "ref", assetRef: string} | {ctype: "id", assetId: string}, database: Sequelize): Promise<{status: "ok"} | {status: "failed", reason: string}> { 
        try {
            if (asset.ctype === "ref") {
                const matchingAssets = await CharacterDB.findAll({ where: { userId, assetRef: asset.assetRef } })
    
                if (matchingAssets.length === 1) {
                    return await this.updateIfNotOnMission(matchingAssets[0].entityId, userId, asset, database)
                } else if (matchingAssets.length < 1) {
                    return { status: 'failed', reason: 'No matching assets found.' }
                } else {
                    return { status: 'failed', reason: 'More than one matching asset found.' }
                }
            } else {
                const matchingAsset = await CharacterDB.findByPk(asset.assetId)
    
                if (!matchingAsset) {
                    return { status: 'failed', reason: 'No matching assets found.' }
                } else {
                    return await this.updateIfNotOnMission(matchingAsset.entityId, userId, asset, database)
                }
            }
        } catch (error) {
            return { status: 'failed', reason: `An error occurred during the operation. ${JSON.stringify(error, null, 4)}` }
        }
    }
    
    async setXP(characters: { entityId: string, xpAPS: vm.APS }[], transaction?: Transaction): Promise<void> {
        await CharacterDB.bulkCreate(characters, { updateOnDuplicate: ["xpAPS"], transaction })
    }
}

/**
 * Note: temporarily every character is an adventurer
 * 
 * @param characterDB 
 * @returns 
 */
const makeCharacter = (objectBuilder: vm.IQMeatadataObjectBuilder) => (characterDB: ICharacterDB): Character => {
    const collection = objectBuilder.characterCollection(characterDB.assetRef)
    const evAPS = objectBuilder.rules.character.evAPS(characterDB.ivAPS, characterDB.xpAPS)
    return {
        ctype: "character",
        entityId: characterDB.entityId,
        entityType: "character-entity",
        userId: characterDB.userId,
        assetRef: characterDB.assetRef,
        name: characterDB.name,
        inActivity: characterDB.inActivity,
        hp: characterDB.hp,
        ivAPS: characterDB.ivAPS,
        xpAPS: characterDB.xpAPS,
        evAPS,
        nextLevelXP: newAPS([
            objectBuilder.rules.character.totalXPRequiredForNextAPSLevel(evAPS.athleticism),
            objectBuilder.rules.character.totalXPRequiredForNextAPSLevel(evAPS.intellect),
            objectBuilder.rules.character.totalXPRequiredForNextAPSLevel(evAPS.charisma),
        ]),
        sprite: objectBuilder.characterSprite(characterDB.assetRef, collection),
        race: objectBuilder.characterRace(characterDB.assetRef, collection),
        characterType: objectBuilder.characterType(characterDB.assetRef, collection),
        collection,
    }
}

const makeCharacterDB = (objectBuilder: vm.IQMeatadataObjectBuilder) => (userId: string, character: InventoryCharacter): Omit<ICharacterDB, "entityId"> => {
    const ivAPS = objectBuilder.characterIVAPS(character.assetRef, character.collection)
    const xpAPS = vm.zeroAPS
    return {
        userId,
        assetRef: character.assetRef,
        name: objectBuilder.characterDefaultName(character.assetRef, character.collection),
        inActivity: false,
        hp: objectBuilder.rules.character.natMaxHitPoints(ivAPS, xpAPS),
        ivAPS,
        xpAPS,
    }
}
