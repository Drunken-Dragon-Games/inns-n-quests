import * as vm from "../game/game-vm"

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
    & { configuration: vm.StakingQuestConfiguration }

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

export const rules = vm.DefaultRuleset.seed("frontend-dev")

export type IdleQuestsInventory = {
    dragonSilver: number
    characters: Record<string, Character> 
    furniture: Record<string, Furniture>
    innState?: Sector
}

export const isCharacter = (obj?: any): obj is Character => 
    obj?.ctype === "character"

export const isFurniture = (obj?: any): obj is Furniture =>
    obj?.ctype === "furniture"

export type GetInventoryResult 
    = { status: "ok", inventory: IdleQuestsInventory }
    | { status: "unknown-user" }

/** Encounters */

export type GetAvailableEncountersResult
    = { status: "ok", availableEncounters: AvailableEncounter[] }

export type AcceptEncounterResult
    = { status: "ok", activeEncounter: ActiveEncounter }
    | { status: "unknown-encounter" }
    | { status: "invalid-adventurers" }

export type GetActiveEncountersResult
    = { status: "ok", activeEncounters: ActiveEncounter[] }

export type ClaimEncounterResult
    = { status: "ok", outcome: vm.EncounterOutcome }
    | { status: "unknown-encounter" }
    | { status: "already-claimed" }
    | { status: "not-finished" }
    | { status: "missing-adventurers", missing: string[] }

/** Staking Quests */

export type GetAvailableStakingQuestsResult
    = { status: "ok", availableQuests: AvailableStakingQuest[] }

export type AcceptStakingQuestResult
    = { status: "ok", takenQuest: TakenStakingQuest }
    | { status: "unknown-quest" }
    | { status: "invalid-adventurers" }

export type GetTakenStakingQuestsResult
    = { status: "ok", takenQuests: TakenStakingQuest[] }
    | { status: "missing-adventurers" }

export type ClaimStakingQuestResult
    = { status: "ok", outcome: vm.StakingQuestOutcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }
