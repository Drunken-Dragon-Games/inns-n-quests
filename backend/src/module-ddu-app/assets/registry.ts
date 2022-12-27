import * as assets from "../../service-asset-management"

import { logger } from "../base-logger";
import { AssetManagementService } from "../../service-asset-management";

export class Registry {

    public policies: assets.RegistryPolicy[] = []

    async load(assetManagementService: AssetManagementService): Promise<void> {
        this.policies = await assetManagementService.registry(logger)
        logger.log.info({ message: `Loaded ${this.policies.length} policies from the asset-management-service` })
    }
}

const registry = new Registry()

export default registry