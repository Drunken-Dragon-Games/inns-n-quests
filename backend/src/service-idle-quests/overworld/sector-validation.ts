import { ObjectsLocations } from "../models";

export function isObjectLocations(locations: any): locations is ObjectsLocations {
    return locations !== null && 
        typeof locations === "object" && 
        Object.keys(locations).every(key => 
            typeof key === "string" && 
            Array.isArray(locations[key]) && 
            locations[key].length === 2 && 
            locations[key].every((x: any) => typeof x === "number"))
}