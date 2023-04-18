export * from "./concurrency"
export * from "./config"
export * from "./utypes"

export const importESmodule = new Function("module", "return import(module)")