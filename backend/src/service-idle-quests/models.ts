import * as vm from "./game-vm"

export type Character 
    = vm.CharacterEntity
    & vm.WithTag<"character">
    & vm.WithOwner 
    & vm.WithSprite 
    & vm.WithActivityState
    & vm.WithSkills
    & vm.WithEV
    & vm.WithNextLevelXP

export type Furniture
    = vm.FurnitureEntity
    & vm.WithTag<"furniture">
    & vm.WithOwner
    & vm.WithSprite

export type AvailableQuest
    = vm.AvailableQuest
    & vm.WithTag<"available-quest">

export type TakenQuest 
    = vm.TakenQuest
    & vm.WithTag<"taken-quest">
    & vm.WithOwner

export type AvailableEncounter
    = vm.Encounter
    & vm.WithTag<"available-encounter">

export type ActiveEncounter
    = vm.ActiveEncounter
    & vm.WithTag<"active-encounter">
    & vm.WithOwner

export type Sector 
    = vm.Sector
    & vm.WithTag<"sector">

export type IdleQuestsInventory = {
    characters: Record<string, Character> 
    furniture: Record<string, Furniture>
    innState?: Sector
}
