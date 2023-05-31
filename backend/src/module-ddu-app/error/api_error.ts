
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
}

export default ApiError;