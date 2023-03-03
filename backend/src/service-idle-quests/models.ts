import * as vm from "./game-vm"

export type Character 
    = vm.CharacterEntity
    & vm.WithOwner 
    & vm.WithSprite 
    & vm.WithActivityState

export type Furniture
    = vm.FurnitureEntity
    & vm.WithOwner
    & vm.WithSprite

export type AvailableQuest
    = vm.AvailableQuest

export type TakenQuest 
    = vm.TakenQuest
    & vm.WithOwner

export type Sector 
    = vm.Sector

export type IdleQuestsInventory = {
    characters: Record<string, Character> 
    furniture: Record<string, Furniture>
    innState?: Sector
}
