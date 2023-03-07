import { Tier1SkillName, Tier1Skills } from "./t1-skills"
import { Tier2SkillName, Tier2Skills } from "./t2-skills"

export * from "./t1-skills"
export * from "./t2-skills"

export type SkillName = Tier1SkillName | Tier2SkillName

export const Skills = { ...Tier1Skills, ...Tier2Skills }
