import { AssetManagementDsl } from './AssetManagementDsl';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const blockfrostApiKey = process.env.BLOCKFROST_API_KEY!
const network = process.env.CARDANO_NETWORK == "mainnet" ? "mainnet" : "preprod";

const blockfrost = new BlockFrostAPI({ projectId: blockfrostApiKey, network: network });
const assetManagementDsl = new AssetManagementDsl(blockfrost);

export {
    assetManagementDsl,
    blockfrost
};