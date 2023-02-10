import axios from "axios"
import { NFT_MOCK_URL } from "../app/settings";
import { IApiNFTs, IWalletNFT } from "../app/types";
import { Adventurer,
         IAdventurerData,
         IAdventurer,
         IAdventurerMetadata } from "./models";
import { Model, Sequelize } from "sequelize/types";
import { gmasMetadata, pixelTileClass, advOfThioldenGameMetadata } from "../app/metadata/metadata"
import { Optional } from "sequelize"
import { AssetManagementService, Inventory } from "../../service-asset-management"
import ApiError from "../app/error/api_error";
import { Policy } from "../app/types";
import { ADVENTURER_PIXELTILES } from "../app/settings";
import { LoggingContext } from "../../tools-tracing"
import { Enrolled, Quest, TakenQuest } from "../quests/models";
import { Player } from "../players/models";
import { onlyPolicies, WellKnownPolicies } from "../../registry-policies";

/////////// SYNCHRONIZATION CLASS //////////
/* 
EXECUTES getAdventurerToCreate AND getAdventurersToDelete IN ORDER TO
HANDLE THE SYNCHRONIZATION PROCESS
*/

class SyncAssets {
    private existingAdventurers: IWalletNFT[] | undefined; // ADVENTURERS IN THE DB
    private walletNFTs: IApiNFTs | undefined; // NFTs IN THE WALLET
    private walletAdventurers: IWalletNFT[] | undefined; // NFTs THAT ARE ADVENTURERS

    // CLASS CONSTRUCTOR, SETS STAKE ADDRESS
    constructor(
        private readonly userId: string,
        private readonly thioldenMetadata: any,
        private readonly wellKnownPolicies: WellKnownPolicies,
        private readonly logger: LoggingContext
    ){}

    // SETS THE NFT AND DB ADVENTURER VARIABLES
    async init(assetManagementService: AssetManagementService, logger: LoggingContext): Promise<void> {
        this.existingAdventurers = await this.getExistingAdventurers();
        this.walletNFTs = await this.requestCurrentNFT(assetManagementService, logger);
        this.walletAdventurers = this.filterAdventurerPixelTiles();
    }

    // REQUEST WALLET NFTs
    async requestCurrentNFT(assetManagementService: AssetManagementService, logger: LoggingContext): Promise<IApiNFTs | undefined> {
        if (process.env.USE_MOCK == "true") {            
            let NFTs = await axios.get(NFT_MOCK_URL, {
                proxy: false,
            })
            .then(axiosResponse => {   
                return axiosResponse.data;
            })
            .catch(error => {
                throw new Error(error.message);    
            });
            return NFTs
        } else {            
            let nftInventory: IApiNFTs = {
                pixeltiles: [],
                gmas: [],
                adv_of_thiolden: []
            }
            // const assetResponse = await assetManagementServiceClient.list(this.userId, logger, { chain: true, policies: policyIds}) 
            const assetResponse = await assetManagementService.list(this.userId, { policies: onlyPolicies(this.wellKnownPolicies) }, logger)  
            logger.log.info({message: "Adventurer response from asset manager", response: assetResponse})
            if (assetResponse.status == "unknown-user") throw new ApiError(404, "unknown_user", "The user was not found")
            const inventory: Inventory = assetResponse.inventory
            logger.log.info({message: "NFTInventory Begins"})
            nftInventory.pixeltiles = inventory[this.wellKnownPolicies.pixelTiles.policyId]?.map(asset => { return { name: asset.unit, quantity: parseInt(asset.quantity) }}) ?? []         
            logger.log.info({message: "Pixeltiles Done"})
            nftInventory.gmas = inventory[this.wellKnownPolicies.grandMasterAdventurers.policyId]?.map(asset => { return { name: asset.unit, quantity: parseInt(asset.quantity) }}) ?? []
            logger.log.info({message: "GMA Done"})
            nftInventory.adv_of_thiolden = inventory[this.wellKnownPolicies.adventurersOfThiolden.policyId]?.map(asset => { return { name: asset.unit, quantity: parseInt(asset.quantity) }}) ?? []
            logger.log.info({message: "Adv Of Thiolden Done"})
            return nftInventory
        }  

    }

    // METHOD THAT FILTERS OUT EVERY PIXELTILE THAT IS NOT AN ADVENTURER
    filterAdventurerPixelTiles(): IWalletNFT[] | undefined {
        let adventurerArray: IWalletNFT[] = new Array()
        Object.keys(this.walletNFTs!).forEach(group => {
            adventurerArray = adventurerArray.concat(this.walletNFTs![group as keyof IApiNFTs])
        })
        const filteredAdventurers = adventurerArray.filter(adventurer => 
            !(!ADVENTURER_PIXELTILES.includes(adventurer.name) && adventurer.name.includes("PixelTile")))
        return filteredAdventurers
    }

    // GET DATA OF THE ADVENTURERS IN THE DB
    async getExistingAdventurers (): Promise<IWalletNFT[]> {
        let existingAdventurersRaw: Model<IAdventurer>[] = await Adventurer.findAll({
            attributes: ['on_chain_ref'],
            where: {
                user_id: this.userId,
            }
        });
        // PARSES THE DB DATA TO (NAME, QUANTITY) NFT FORMAT
        let existingAdventurers: IWalletNFT[] = new Array;
        existingAdventurersRaw.forEach((adventurerRaw: Model<IAdventurer>) => {
            let exists: IWalletNFT | undefined = existingAdventurers.find((adventurer: IWalletNFT) => adventurer.name == adventurerRaw.getDataValue("on_chain_ref"));
            // ADDS 1 TO THE QUANTITY IF THERE ARE MULTIPLE INSTANCES OF THE SAME ADVENTURER OR ADDS IT TO THE ARRAY
            if (exists) {
                let index: number = existingAdventurers.indexOf(exists);
                existingAdventurers[index].quantity++;
            } else {
                existingAdventurers.push({
                    "name": adventurerRaw.getDataValue("on_chain_ref"),
                    "quantity": 1
                })
            }
        })
        return existingAdventurers;
    }

    /* 
    GETS THE DATA OF THE ADVENTURERS THAT NEED TO BE CREATED IN THE FORMAT OF (NAME, QUANTITY)
    *********** QUANTITY IS THE NUMBER OF ADVENTURERS OF THE SAME TYPE THAT WILL BE CREATED
    */ 
    getAdventurersToCreate(): IWalletNFT[] | undefined{
        // COMPARES WALLET NFT ADVENTURERS WITH DB ADVENTURERS
        let adventurersToCreateNFT: (IWalletNFT | undefined)[] | undefined = this.walletAdventurers?.map((walletAdventurer: IWalletNFT) => {
            let adventurerMatch = this.existingAdventurers?.find((existingAdventurer: IWalletNFT) => existingAdventurer.name == walletAdventurer.name);
            // IF IT FINDS A MATCH AND THE WALLET HAS MORE INSTANCES OF THE SAME ADVENTURER THAN THE DB ADDS THE DIFFERENCE TO AN ARRAY
            if (adventurerMatch) {
                let quantityDiff = walletAdventurer.quantity - adventurerMatch.quantity
                if(quantityDiff > 0) return {
                    "name": walletAdventurer.name,
                    "quantity": quantityDiff
                }
            // IF IT DOES NOT FIND A MATCH, ADDS ALL THE ADVENTURERS OF THE SAME TYPE IN THE WALLET
            } else {
                return {
                    "name": walletAdventurer.name,
                    "quantity": walletAdventurer.quantity
                }
            }
        });

        // FILTERS OUT ALL THE UNDEFINED FIELDS
        let adventurersToCreateData: any
        if (adventurersToCreateNFT !== undefined){
            adventurersToCreateData = adventurersToCreateNFT.filter((adventurer: IWalletNFT | undefined): Boolean => {
                return adventurer !== undefined
            })
        }
        return adventurersToCreateData
    }

    /* 
    PARSES THE DATA OF FORMAT **(NAME, QUANTITY) TO THE MODEL ADVENTURER TYPE (ON_CHAIN_REF, PLAYER) FORMAT 
    WHEN PARSING ADVENTURERS TO CREATE, RETURNS A LIST OF STRING THE PARSING ADVENTURERS TO DELETE

    IF DATA (NAME: GMA03, QUANTITY: 2) RETURNS [{ON_CHAIN_REF: GMA03, PLAYER}, {ON_CHAIN_REF: GMA03, PLAYER}] ON CREATION
    IF DATA (NAME: GMA03, QUANTITY: 2) RETURNS ["GMA03", "GMA03"] ON DELETE
    ** MAY BE A BETTER SOLUTION WITH FOREACH
    */
    parseAdventurersData(adventurerDataList: IWalletNFT[], toDelete: Boolean = false) {
        // CREATES A LIST OF LISTS WHEN DESTRUCTURING SEVERAL ADVENTURERS OF THE SAME TYPE
        let adventurerMetadata: any = {
            pixeltile: {
                type: "pixeltile",
                in_game_metadata: {},
                metadata: pixelTileClass
            },
            grandmasteradventurer: {
                type: "gma",
                in_game_metadata: { is_alive: true, dead_cooldown: 0},
                metadata: gmasMetadata
            },
            adventurerofthiolden: {
                type: "aot",
                in_game_metadata: {},
                metadata: this.thioldenMetadata,
                game_metadata: advOfThioldenGameMetadata
            }
        }
        let adventurersToCreate = adventurerDataList.map((adventurer: IWalletNFT) => {
            let dataToBePushed: Array<IAdventurerData | string> = new Array()
            let type: string
            let metadata: IAdventurerMetadata 
            let dd_class: string
            let race: string
            Object.keys(adventurerMetadata).forEach(typeGroup => {
                if(adventurer.name.toLowerCase().includes(typeGroup)){
                    type = (adventurerMetadata[typeGroup] as any).type
                    metadata = (adventurerMetadata[typeGroup] as any).in_game_metadata
                    if(typeGroup == "pixeltile" || typeGroup == "grandmasteradventurer"){
                        dd_class = (adventurerMetadata[typeGroup] as any).metadata[adventurer.name].class
                        race = (adventurerMetadata[typeGroup] as any).metadata[adventurer.name].race
                    } else if(typeGroup == "adventurerofthiolden"){
                        const idx = parseInt(adventurer.name.replace("AdventurerOfThiolden", "")) - 1
                        const adventurerName = (adventurerMetadata[typeGroup] as any).metadata[idx].adv
                        dd_class = (adventurerMetadata[typeGroup] as any).game_metadata[adventurerName]["Game Class"].toLowerCase()
                        race = (adventurerMetadata[typeGroup] as any).game_metadata[adventurerName].Race    
                    }
                }
            })
            for (let i = 0; i < adventurer.quantity; i++) {
                if (!toDelete) dataToBePushed.push({
                    on_chain_ref: adventurer.name,
                    user_id: this.userId,
                    type: type!,
                    metadata: metadata!,
                    class: dd_class!.toLowerCase(), 
                    race: race!.toLowerCase()
                })
                else if(toDelete) dataToBePushed.push(adventurer.name)
            }
            return dataToBePushed;
        });
        
        return [].concat(...adventurersToCreate as never[]); // RETURNS A SINGLE LIST
    }

    /* 
    GETS THE DATA OF THE ADVENTURERS THAT NEED TO BE DELETED IN THE FORMAT OF (NAME, QUANTITY)
    *********** QUANTITY IS THE NUMBER OF ADVENTURERS OF THE SAME TYPE THAT WILL BE DELETED
    */ 
    getAdventurersToDelete(): IWalletNFT[] | undefined  {
        // COMPARES DB ADVENTURERS WITH WALLET NFT ADVENTURERS
        let adventurersToDeleteNFT: (IWalletNFT | undefined)[] | undefined = this.existingAdventurers?.map((existingAdventurer: IWalletNFT) => {
            let adventurerMatch = this.walletAdventurers?.find((walletAdventurer: IWalletNFT) => walletAdventurer.name == existingAdventurer.name);
            // IF IT FINDS A MATCH AND THE WALLET HAS LESS INSTANCES OF THE SAME ADVENTURER THAN THE DB ADDS THE DIFFERENCE TO AN ARRAY
            if (adventurerMatch) {
                let quantityDiff = existingAdventurer.quantity - adventurerMatch.quantity
                if(quantityDiff > 0) return {
                    "name": existingAdventurer.name,
                    "quantity": quantityDiff
                }
            // IF IT DOES NOT FIND A MATCH, ADDS ALL THE ADVENTURERS OF THE SAME TYPE IN THE WALLET
            } else {
                return {
                    "name": existingAdventurer.name,
                    "quantity": existingAdventurer.quantity
                }
            }
        });
        // FILTERS OUT ALL THE UNDEFINED FIELDS
        let adventurersToDeleteData: any
        if (adventurersToDeleteNFT !== undefined){
            adventurersToDeleteData = adventurersToDeleteNFT.filter((adventurer: IWalletNFT | undefined): Boolean => {
                return adventurer !== undefined
            })
        }
        return adventurersToDeleteData
    }

    // METHOD THAT PERFORMS THE SYNCHRONIZATION
    async sync(sequelize: Sequelize, logger: LoggingContext) {
        //logger.log.info({message: "trying to sync assets"})
        let adventurersToCreateData: IWalletNFT[] | undefined;
        let adventurersToCreate: Optional<IAdventurerData, 'id' | 'experience' | 'in_quest'>[];
        let adventurersToDeleteData: IWalletNFT[] | undefined;
        if (this.existingAdventurers) {            
            adventurersToDeleteData = this.getAdventurersToDelete();
            //logger.log.info({message: "adventurers to delete:", adventurersToDeleteData})
        }
        if (this.walletAdventurers){
            adventurersToCreateData = this.getAdventurersToCreate();
            if (adventurersToCreateData) adventurersToCreate = this.parseAdventurersData(adventurersToCreateData);
            //logger.log.info({message: "adventurers to Create:", adventurersToCreateData})
        }

        // console.log(adventurersToCreate);
        // console.log(adventurersToDelete);

        // ORM METHODS TO UPDATE THE DB
        try {
            const result = await sequelize.transaction (async transaction => {
                // CREATES IN BULK
                if(adventurersToCreate) 
                    await Adventurer.bulkCreate(adventurersToCreate, { transaction });
                if(adventurersToDeleteData) {
                    // Picks the adventurers to delete
                    const adventurersToDelete = await Promise.all(adventurersToDeleteData.map(adv => {
                        return Adventurer.findAll({
                            where: { on_chain_ref: adv.name, user_id: this.userId },
                            order: [['experience', 'ASC']],
                            limit: adv.quantity,
                            transaction
                        })
                    })).then(arr => arr.flat())

                    // Finds and deletes the taken quests of the adventurers to delete
                    for (const adv of adventurersToDelete) {
                        const res = await sequelize.query('SELECT taken_quests.id FROM taken_quests INNER JOIN enrolls ON taken_quests.id = enrolls.taken_quest_id WHERE enrolls.adventurer_id = :adventurerId', { replacements: { adventurerId: adv.id }, transaction })
                        const takenQuestsIds = res[0].map((quest: any) => quest.id)
                        await sequelize.query('UPDATE adventurers SET in_quest = false WHERE id IN (SELECT adventurer_id FROM enrolls WHERE taken_quest_id IN (:takenQuestsIds))', { replacements: { takenQuestsIds }, transaction })
                        await Enrolled.destroy({ where: { taken_quest_id: takenQuestsIds }, transaction })
                        await TakenQuest.destroy({ where: { id: takenQuestsIds }, transaction })
                    }

                    // Deletes the adventurers to delete
                    await Adventurer.destroy({
                        where: { id: adventurersToDelete.map(adv => adv.id) },
                        transaction
                    })
                }
                    /* 
                    DELETES IN BULK ADVENTURER WITH LOWEST LEVEL
                    RAW SQL NEEDED TO PERFORM COMPLICATED QUERY
                    */

                    /*
                    for (let i = 0; i < adventurersToDeleteData.length; i++) {
                        await Adventurer.destroy({ 
                            where: { 
                                id: [
                                    
sequelize.literal(`(SELECT id FROM adventurers WHERE on_chain_ref = '${adventurersToDeleteData[i].name}' AND user_id = '${this.userId}'ORDER BY experience ASC LIMIT ${adventurersToDeleteData[i].quantity})`)
                                ], 
                            },
                            transaction: t
                        });
                    }
                    */
            });
        } catch (error) {
            logger.log.error({message: "Assets could not be synchronized", error})
            throw new Error("Assets could not be synchronized");
        }
        
    }
}
 export default SyncAssets;