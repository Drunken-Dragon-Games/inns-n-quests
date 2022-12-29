
export const blockfrost = {
	cardanoMainnetApiKey: process.env.BLOCKFROST_CARDANO_API_KEY ?? "",
    cardanoTestnetApiKey: process.env.BLOCKFROST_CARDANO_API_KEY ?? "",
	ipfsApiKey: process.env.BLOCKFROST_IPFS_API_KEY ?? ""
};

export const policies = {
	ADA_HANDLE: "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a",
	PIXEL_TILES: process.env.POLICY_PIXEL_TILES,
	GRANDMASTER_ADVENTURERS: process.env.POLICY_GRAND_MASTER_ADVENTURERS,
	ADV_OF_THIOLDEN: process.env.POLICY_ADVENTURERS_OF_THIOLDEN,
	EMOJIS: "f04013fcf5d7eec7c2f7623332900f9691c75a73c740f9f1459fe6ee",
	DRAGON_SILVER: process.env.POLICY_DRAGON_SILVER,
	DDxJPEG_PETS: ""
};