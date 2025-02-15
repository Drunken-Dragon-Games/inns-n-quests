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

export type AvailableStakingQuest
    = vm.StakingQuest
    & vm.WithTag<"available-staking-quest">

export type TakenStakingQuest 
    = vm.TakenStakingQuest
    & vm.WithTag<"taken-staking-quest">
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
    dragonSilver: number
    characters: Record<string, Character> 
    furniture: Record<string, Furniture>
    innState?: Sector
}

export type Leaderboard = {userId: string, succeededQuests: number}[]
