import { Tier1SkillName, Tier1Skills } from "./t1-skills.js"
import { Tier2SkillName, Tier2Skills } from "./t2-skills.js"

export * from "./t1-skills.js"
export * from "./t2-skills.js"

export type SkillName = Tier1SkillName | Tier2SkillName

export const Skills = { ...Tier1Skills, ...Tier2Skills }
