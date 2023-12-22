import { Op } from "sequelize";
import { AssetState, Token } from "../models";
import { AOTStoreAsset } from "./aot-invenotry-db";
import { AssetManagementService } from "../../service-asset-management";

export class AOTInventory {
    constructor(public readonly AOTPolicy: string){}

    static async stockInventory(tokenNames: string[]):Promise<void>{
        const stock = tokenNames.map(aot => {return {tokenName: aot}})
        await AOTStoreAsset.bulkCreate(stock)
    }
    

    private async updateAssetState(assets: Token[], newState: AssetState, newContractId?: string | null): Promise<void> {
        try {
            const tokenNames = assets.map(token => token.token_name)
            const assetsToUpdate = await AOTStoreAsset.findAll({
                where: { tokenName: { [Op.in]: tokenNames } }
            })

            for (const asset of assetsToUpdate) {
                asset.state = newState
                if (newContractId !== undefined) asset.contract = newContractId
                await asset.save()
            }
        } catch (error) {
            console.error(`Error updating asset state to ${newState}:`, error);
        }
    }

    async reserveAssets(quantity: number): Promise<Token[]>{
        try {
            const idleAssets = await AOTStoreAsset.findAll({where: {state: 'idle'}})
            if (idleAssets.length < quantity) throw new Error('Not enough idle assets to reserve.')
            const selectedAssets: Token[] = []
            while (selectedAssets.length < quantity) {
                const randomIndex = Math.floor(Math.random() * idleAssets.length)
                const randomAsset = idleAssets.splice(randomIndex, 1)[0]
                selectedAssets.push({
                    currency_symbol: this.AOTPolicy,
                    token_name: randomAsset.tokenName
                })
            }
            await this.updateAssetState(selectedAssets, 'reserved')
            return selectedAssets
          } catch (error) {
            console.error('Error reserving assets:', error)
            return []
          }
    }

    async reserveUnder(assets: Token[], contractId: string){
        await this.updateAssetState(assets, 'reserved', contractId)
    }

    async releaseReservedAssets(assets: Token[]){
        await this.updateAssetState(assets, 'idle', null)
    }

    async markAssetsAsSold(assets: Token[]){
        await this.updateAssetState(assets, 'sold')
    }

    static async isEmpty(){
        const count = await AOTStoreAsset.count({ where: { state: 'idle' } })
        return count < 1
    }
}