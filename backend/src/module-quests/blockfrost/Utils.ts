import { bech32 } from "bech32";

export const toHex = (str: string): string => {
	var i;
	var result = "";
	for (i=0; i<str.length; i++) {
		result += str.charCodeAt(i).toString(16);
	}
	return result
}

export const fromHex = (str: string): string => 
	Buffer.from(str, 'hex').toString('utf8')

/** Extracts the stake address of a Cardano address according to 
 *  https://cardano.stackexchange.com/questions/2003/extract-the-bech32-stake-address-from-a-shelly-address-in-javascript/2004#2004
 * 
 * @param address 
 * @returns 
 */
export const extractStakeAddress = (address: string): string => {
	const addressWords = bech32.decode(address, 1000)
	const payload = bech32.fromWords(addressWords.words)
	const addressDecoded = `${Buffer.from(payload).toString('hex')}`
	const stakeAddressDecoded = 'e1'+addressDecoded.substr(addressDecoded.length - 56)
	const stakeAddress = bech32.encode(
		'stake',
		bech32.toWords(Uint8Array.from(Buffer.from(stakeAddressDecoded, 'hex'))),
		1000
	)
	return stakeAddress
}