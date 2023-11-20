import { Token } from "../models";

export class AOTInventory {
    constructor(private readonly AOTPolicy: string){}

    /*
    async loadCollection
    */

    async reserveAssets(quantity: number): Promise<Token[]>{
        return []
    }

    async releaseReservedAssets(assets: Token[]){}

    async markAssetsAsInContract(assets: Token[], contractId: string){}

    async markAssetsAsSold(assets: Token[]){}
}