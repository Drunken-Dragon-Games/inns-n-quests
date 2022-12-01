

export const validateStakeAddress = (stakeAddress: string, network: string): boolean => {
    const specialChars = /[`!@#$%^&*()\-=\[\]{};':"\\|,.<>\/?~]/;
    const mainnetValidation = (): boolean => 
        stakeAddress.length == 59 && !stakeAddress.includes("test") && !specialChars.test(stakeAddress)
    const testnetValidation = (): boolean =>
        stakeAddress.length == 64 && stakeAddress.includes("test") && !specialChars.test(stakeAddress)
    return (network === "mainnet" ? mainnetValidation() : testnetValidation())
}