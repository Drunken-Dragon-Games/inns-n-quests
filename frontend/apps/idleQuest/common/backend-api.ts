import * as randomseed from "random-seed"
import * as vm from "../game-vm"

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
    = vm.AvailableStakingQuest
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

export type GetInventoryResult 
    = { status: "ok", inventory: IdleQuestsInventory }
    | { status: "unknown-user" }

export class IdleQuestsRandomGenerator extends vm.IQRandom {
    private readonly random: randomseed.RandomSeed
    constructor (seed: string) { 
        super(); this.random = randomseed.create(seed) }
    genrand(): number { 
        return this.random.random() }
    seed(s: string): vm.IQRandom { 
        return new IdleQuestsRandomGenerator(s) }
}

export const random = new IdleQuestsRandomGenerator("dev")

export const rules = new vm.DefaultRuleset(random)

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

export type ClaimStakingQuestResult
    = { status: "ok", outcome: vm.StakingQuestOutcome }
    | { status: "unknown-quest" }
    | { status: "quest-already-claimed" }
    | { status: "quest-not-finished" }
    | { status: "missing-adventurers", missing: string[] }
