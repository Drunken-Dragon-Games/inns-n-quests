//import { logger } from "../middleware/winston_middleware";
import { logger } from "../base-logger"

class ApiError extends Error {
    readonly status: number;
    readonly code: string

    constructor(status: number, code: string, ...params: any) {
        super(...params);        
        this.status = status;
        this.code = code;
    }

    static debug(msg: string) {
        console.error(msg);
    }

    static log(msg: string, isWarning: boolean){
        if (isWarning) {
            logger.log.error(msg);
        }
    }
}

export default ApiError;