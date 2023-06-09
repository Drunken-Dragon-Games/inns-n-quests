import { AdventurerClass, CrafterClass } from "../character-entity"
import { DamageType, Condition, SkillInfo } from "../encounter"

export const skillTag = (info: SkillInfo): SkillInfo => info

export const damageTag = (types?: DamageType[]): DamageType[] | undefined => types

export const conditionTag = (types?: Condition[]): Condition[] | undefined => types

export const classTag = (types?: AdventurerClass[] | CrafterClass[]): AdventurerClass[] | CrafterClass[] | undefined => types