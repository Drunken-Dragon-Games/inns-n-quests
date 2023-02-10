import { BlockFrostAPI } from "@blockfrost/blockfrost-js"

export default class BlockFrostAPIMock {

    public readonly service: BlockFrostAPI

    constructor() {
        this.service = new BlockFrostAPI({ projectId: "preprod00000000000000000000000000000000" }) 
    }

    accountsAddressesAssetsReturns(response: { unit: string, quantity: string }[]) {
        return jest.spyOn(this.service, "accountsAddressesAssets")
            .mockReturnValueOnce(Promise.resolve(response))
    }

    accountsAddressesReturns(response: { address: string }[]) {
        return jest.spyOn(this.service, "accountsAddresses")
            .mockReturnValueOnce(Promise.resolve(response))
    }

    blocksLatestReturs(response: { 
        time: number, 
        height: number, 
        hash: string, 
        slot: number, 
        epoch: number, 
        epoch_slot: number,
        slot_leader: string,
        size: number,
        tx_count: number,
        output: null,
        fees: null,
        block_vrf: string,
        op_cert: string,
        op_cert_counter: string,
        previous_block: string,
        next_block: null,
        confirmations: number }) {
            return jest.spyOn(this.service, "blocksLatest")
                .mockReturnValueOnce(Promise.resolve(response))
        }
    
    addressesUtxosAllReturns(response: {
        tx_hash: string,
        tx_index: number,
        output_index: number,
        amount: 
            {
                unit: string,
                quantity: string
            }[],
        block: string,
        data_hash: null,
        inline_datum: null,
        reference_script_hash: null }[]) {
            return jest.spyOn(this.service, "addressesUtxosAll")
                .mockReturnValueOnce(Promise.resolve(response))
        }
    
    txSubmitReturns(response: string) {
        return jest.spyOn(this.service, "txSubmit")
            .mockReturnValueOnce(Promise.resolve(response))
    }

    txsResponse(response: {
        hash: string,
        block: string,
        block_height: number,
        block_time: number,
        slot: number,
        index: number,
        output_amount: {
            unit: string,
            quantity: string,
        }[],
        fees: string,
        deposit: string,
        size: number,
        invalid_before: string | null,
        invalid_hereafter: string | null,
        utxo_count: number,
        withdrawal_count: number,
        mir_cert_count: number,
        delegation_count: number,
        stake_cert_count: number,
        pool_update_count: number,
        pool_retire_count: number,
        asset_mint_or_burn_count: number,
        redeemer_count: number,
        valid_contract: boolean},) {
            return jest.spyOn(this.service, "txs")
                .mockReturnValueOnce(Promise.resolve(response))
        }
}