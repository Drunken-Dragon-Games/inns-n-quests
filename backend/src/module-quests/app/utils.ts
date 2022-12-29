import { RegistryPolicy } from "../../service-asset-management";
import { Policy } from "./types";
import { logger } from "../base-logger"
import { AssetManagementService } from "../../service-asset-management";

const shuffle = <T>(a: T[]) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const getRandomElement = <T>(elementList: T[]): T => {
    let randomNumber: number = Math.random() * (elementList.length - 1);
    let roundRandomNumber: number = Math.round(randomNumber);
    return elementList[roundRandomNumber]
}

const getNumberInRange = (min: number, max: number, round: boolean = true): number => {
    let number = Math.random() * (max - min) + min;
    if (round) {
        number = Math.round(number);
    }
    return number;
}



class Registry {
    public policies: Policy = {}

   async load(assetManagementService: AssetManagementService): Promise<void> {
        const amPolicies = await assetManagementService.registry(logger)
        logger.log.info({message: `initializing policy registry with ${amPolicies.length}`, amPolicies})
        const policies: Policy = {
            pixeltiles: amPolicies.find((policy: RegistryPolicy) => policy.name == "Pixel Tiles")?.policyId!,
            gmas: amPolicies.find((policy: RegistryPolicy) => policy.name == "Grandmaster Adventurers")?.policyId!,
            aots: amPolicies.find((policy: RegistryPolicy) => policy.name == "Adventurers of Thiolden")?.policyId!,
            ds: amPolicies.find((policy: RegistryPolicy) => policy.name == "Dragon Silver")?.policyId!
        }
        logger.log.info({message: "initializing policy registry gettting policies", policies})
        Object.keys(policies).forEach(policy => {
            if (policies[policy] == undefined) throw new Error(`Policy ${policy} is undefined`)
        })

        this.policies = policies
   }
}

export const registry = new Registry()

export {
    shuffle,
    getRandomElement,
    getNumberInRange
}