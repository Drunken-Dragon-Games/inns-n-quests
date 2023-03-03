import { v4 } from "uuid"

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

export type NewIQEntityProps = {
    assetRef: string
    name: string
}

export const newIQEntity = <EType extends IQEntityType>(entityType: EType, props: NewIQEntityProps): IQEntity<EType> => 
    ({ entityId: v4(), entityType, ...props })

export type WithSprite = {
    sprite: string
}

export type WithActivityState = {
    inActivity: boolean
}

export type WithOwner = {
    userId: string
}
