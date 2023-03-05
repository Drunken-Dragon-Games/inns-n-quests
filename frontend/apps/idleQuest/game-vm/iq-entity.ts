import { APS } from "../common"
import { SkillName } from "./encounter"

export type IQEntity<EType extends IQEntityType> = {
    entityId: string
    entityType: EType
    assetRef: string
    name: string
}

export type IQEntityType 
    = "character-entity" | "furniture-entity"

export const IQEntityTypes: IQEntityType[] = 
    [ "character-entity" , "furniture-entity" ]

export type WithSprite = {
    sprite: string
}

export type WithActivityState = {
    inActivity: boolean
}

export type WithOwner = {
    userId: string
}

export type WithSkills = {
    skills?: SkillName[]
}

export type WithEV = {
    evAPS: APS
}

export type WithTag<Tag extends string> = {
    ctype: Tag
}