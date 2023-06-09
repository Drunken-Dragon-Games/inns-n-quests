import { ObjectsLocations } from "./sector.js";

export function isObjectLocations(locations: any): locations is ObjectsLocations {
    return locations !== null && 
        typeof locations === "object" && 
        Object.keys(locations).every(key => 
            typeof key === "string" &&
            typeof locations[key] === "object" &&
            'cord' in locations[key] &&
            'flipped' in locations[key] &&
            Array.isArray(locations[key].cord) && 
            locations[key].cord.length === 2 && 
            locations[key].cord.every((x: any) => typeof x === "number") &&
            typeof locations[key].flipped === "boolean"
  )
            
}