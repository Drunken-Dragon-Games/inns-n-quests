import { DataTypes, Model, Op, Sequelize, Transaction } from "sequelize"
import { MetadataRegistry } from "../../registry-metadata"
import { WellKnownPolicies } from "../../registry-policies"
import * as am from "../../service-asset-management"
import * as vm from "../game-vm"
import { IQRuleset } from "../game-vm"
import { Character } from "../models"
import { syncData } from "./sync-util"

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

export const CharacterDBTableName = "idle_quests_characters"

export const CharacterDBTableAttributes = {
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
}

export const configureSequelizeModel = (sequelize: Sequelize): void => {
    CharacterDB.init(CharacterDBTableAttributes, {
        sequelize, 
        modelName: 'CharacterDB', 
        tableName: CharacterDBTableName
    })
}

type InventoryCharacter = {
    assetRef: string
    collection: vm.CharacterCollection
    quantity: number
}

export default class CharacterState {

    constructor(
        private readonly metadataRegistry: MetadataRegistry,
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly rules: vm.IQRuleset,
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
        return characters.map(makeCharacter(this.metadataRegistry, this.rules))
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
            [...Array(character.quantity)].map(() => makeCharacterDB(this.metadataRegistry, this.rules)(userId, character))
        ), { transaction })
        return created.map(makeCharacter(this.metadataRegistry, this.rules))
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
        
        const pickInventoryCharacters = (): InventoryCharacter[] => {
            const pxs: InventoryCharacter[] = (assetInventory[this.wellKnownPolicies.pixelTiles.policyId] ?? [])
                .filter(pxt => 
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Adventurer" ||
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Monster" ||
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].type == "Townsfolk" || 
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].name == "PixelTile #24 Guard" ||
                    this.metadataRegistry.pixelTilesMetadata[pxt.unit].name == "PixelTile #45 Recruit"
                )
                .map(pxt => ({ assetRef: pxt.unit, collection: "pixel-tiles", quantity: parseInt(pxt.quantity) }))
            const gmas: InventoryCharacter[] = (assetInventory[this.wellKnownPolicies.grandMasterAdventurers.policyId] ?? [])
                .map(gma => ({ assetRef: gma.unit, collection: "grandmaster-adventurers", quantity: parseInt(gma.quantity) }))
            const aots: InventoryCharacter[] = (assetInventory[this.wellKnownPolicies.adventurersOfThiolden.policyId] ?? [])
                .map(aot => ({ assetRef: aot.unit, collection: "adventurers-of-thiolden", quantity: parseInt(aot.quantity) }))
            return [...pxs, ...gmas, ...aots]
        }

        const preSyncedAdventurers: ICharacterDB[] = (await CharacterDB.findAll({ where: { userId } })).map(makeCharacter(this.metadataRegistry, this.rules))
        const assetInventoryAdventurers = pickInventoryCharacters()
        const { toCreate, toDelete, surviving } = syncData(preSyncedAdventurers, assetInventoryAdventurers)
        const createdAdventurers = await this.bulkCreate(userId, toCreate, transaction)
        await this.bulkDelete(toDelete.map(c => c.entityId), transaction)
        return createdAdventurers.concat(surviving.map(makeCharacter(this.metadataRegistry, this.rules)))
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
        return adventurers.map(makeCharacter(this.metadataRegistry, this.rules))
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
        return adventurers.map(makeCharacter(this.metadataRegistry, this.rules))
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
const makeCharacter = (metadataRegistry: MetadataRegistry, rules: IQRuleset) => (characterDB: ICharacterDB): Character => {
    const collection = vm.characterCollection(characterDB.assetRef)
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
        evAPS: rules.character.evAPS(characterDB.ivAPS, characterDB.xpAPS),
        sprite: vm.characterSprite(metadataRegistry)(characterDB.assetRef, collection),
        race: vm.characterRace(metadataRegistry)(characterDB.assetRef, collection),
        characterType: vm.characterType(metadataRegistry)(characterDB.assetRef, collection),
        collection,
    }
}

const makeCharacterDB = (metadataRegistry: MetadataRegistry, rules: IQRuleset) => (userId: string, character: InventoryCharacter): Omit<ICharacterDB, "entityId"> => {
    const ivAPS = vm.characterIVAPS(metadataRegistry)(character.assetRef, character.collection)
    const xpAPS = vm.zeroAPS
    return {
        userId,
        assetRef: character.assetRef,
        name: vm.characterDefaultName(metadataRegistry)(character.assetRef, character.collection),
        inActivity: false,
        hp: rules.character.natMaxHitPoints(ivAPS, xpAPS),
        ivAPS,
        xpAPS,
    }
}