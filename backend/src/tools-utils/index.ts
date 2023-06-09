export * from "./concurrency.js"
export * from "./config.js"
export * from "./utypes.js"

export const importESmodule = new Function("module", "return import(module)")