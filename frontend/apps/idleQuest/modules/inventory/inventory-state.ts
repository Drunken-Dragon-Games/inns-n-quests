import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Adventurer, TakenQuest, Outcome, individualXPReward, tagRealAPS } from "../../dsl"
import { Furniture } from "../../dsl/furniture"
import { DraggableItem, InventoryAsset, InventorySelection, SelectedQuest } from "./inventory-dsl"

const sortAdventurers = (adventurers: Adventurer[]) => {
    return adventurers.sort((a, b) => {
        if(a.inChallenge && !b.inChallenge){
            return 1
        }
        if(!a.inChallenge && b.inChallenge){
            return -1
        }
        return 0
    })
}

export interface InventoryState {
    appReady: boolean[]

    open: boolean
    adventurers: Adventurer[]
    furniture: Furniture[]
    takenQuests: TakenQuest[]

    selection?: InventorySelection
    dragging?: [DraggableItem, boolean]
    selectedParty: (Adventurer | null)[]
}

const inventoryInitialState: InventoryState = { 
    appReady: [false, false],

    open: false,
    adventurers: [],
    furniture: [],
    takenQuests: [],

    selectedParty: [],
}

export const inventoryState = createSlice({
    name: "inventory-state",
    initialState: inventoryInitialState,
    reducers: {

        finishLoadingModule: (state, action: PayloadAction<{ module: number }>) => {
            state.appReady = state.appReady
                .map((loading, index) => index === action.payload.module ? true : loading)
        },

        toggleInventory: (state) => {
            state.open = !state.open
        },

        setInventory: (state, action: PayloadAction<InventoryAsset[]>) => {
            const adventurers = action.payload.filter(asset => asset.ctype === "adventurer") as Adventurer[]
            const furniture = action.payload.filter(asset => asset.ctype === "furniture") as Furniture[]
            state.adventurers = sortAdventurers(adventurers)
            state.furniture = furniture
        },

        setTakenQuests: (state, action: PayloadAction<TakenQuest[]>) => {
            state.takenQuests = action.payload
        },

        addTakenQuest: (state, action: PayloadAction<TakenQuest>) => {
            state.takenQuests = [...state.takenQuests, action.payload]
        },

        removeTakenQuest: (state, action: PayloadAction<TakenQuest>) => {
            state.takenQuests = state.takenQuests.filter(quest => quest.takenQuestId !== action.payload.takenQuestId)
        },

        selectQuest: (state, action: PayloadAction<SelectedQuest>) => {
            const quest = action.payload
            state.selection = quest
            if (quest.ctype === "available-quest")
                state.selectedParty = Array(quest.slots).fill(null)
            else
                state.selectedParty = Array(quest.quest.slots).fill(null).map((_, index) => 
                    state.adventurers.find(adventurer => adventurer.adventurerId === quest.adventurerIds[index]) ?? null)
        },

        unselectQuest: (state) => {
            state.selection = undefined
            state.selectedParty = []
        },

        pickAdventurerForQuest: (state, action: PayloadAction<Adventurer>) => {
            if (!state.selection) return
            const indexNull = state.selectedParty.indexOf(null)
            const indexAdventurer = state.selectedParty
                .map(a => a ? a.adventurerId : a)
                .indexOf(action.payload.adventurerId)
            const alreadySelected = indexAdventurer !== -1
            const partyFull = indexNull === -1
            if (alreadySelected)
                state.selectedParty[indexAdventurer] = null
            else if (partyFull) 
                state.selectedParty[0] = action.payload
            else 
                state.selectedParty[indexNull] = action.payload
        },

        unPickAdventurerForQuest: (state, action: PayloadAction<Adventurer>) => {
            state.selectedParty = state.selectedParty.map(adventurer => 
                adventurer?.adventurerId === action.payload.adventurerId ? null : adventurer)
        },

        dragItemStarted: (state, action: PayloadAction<DraggableItem>) => {
            state.dragging = [action.payload, true]
        },

        dragItemEnded: (state, action: PayloadAction<DraggableItem>) => {
            state.dragging = [action.payload, false]
        },

        clearSelectedParty: (state) => {
            if (state.selection && state.selection.ctype === "available-quest")
                state.selectedParty = Array(state.selection.slots).fill(null)
            else 
                state.selectedParty = []
        },
        
        changeAdventurersInChallenge: (state, action: PayloadAction<{ adventurers: Adventurer[], inChallenge: boolean }>) => {
            state.adventurers.forEach(adventurer => {
                action.payload.adventurers.forEach((actionAdventurer) => {
                    if(actionAdventurer.adventurerId == adventurer.adventurerId){
                        adventurer.inChallenge = action.payload.inChallenge
                        return 
                    }
                })
            })
            state.adventurers = sortAdventurers(state.adventurers)
        },

        claimQuestOutcome: (state, action: PayloadAction<{ adventurers: Adventurer[], outcome: Outcome, takenQuest: TakenQuest }>) => {
            const outcome = action.payload.outcome
            const adventurers = action.payload.adventurers
            if (state.selection && state.selection.ctype === "taken-quest" && state.selection.takenQuestId === action.payload.takenQuest.takenQuestId)
                state.selection.claimedAt = new Date().toISOString()
            if (outcome.ctype === "success-outcome" && outcome.reward.apsExperience) {
                const individualXP = individualXPReward(adventurers, outcome.reward.apsExperience)
                state.adventurers = state.adventurers.map(adventurer => {
                    const inParty = action.payload.adventurers.find((actionAdventurer) => 
                        actionAdventurer.adventurerId == adventurer.adventurerId)
                    if (inParty) {
                        return tagRealAPS({
                            ...inParty, 
                            inChallenge: false,
                            athXP: inParty.athXP + individualXP[inParty.adventurerId].athleticism,
                            intXP: inParty.intXP + individualXP[inParty.adventurerId].intellect,
                            chaXP: inParty.chaXP + individualXP[inParty.adventurerId].charisma,
                        }) as Adventurer
                    } else {
                        return adventurer
                    }
                })
                state.selectedParty = state.selectedParty.map(adventurer => {
                    if (!adventurer) return adventurer
                    return state.adventurers.find(a => a.adventurerId === adventurer.adventurerId)!
                })
            }
        },

        selectAdventurer: (state, action: PayloadAction<Adventurer | undefined>) => {
            state.selection = action.payload
        },
    },
});

export const {
    finishLoadingModule,
    toggleInventory,
    setInventory,
    setTakenQuests,
    addTakenQuest,
    removeTakenQuest,
    selectQuest,
    unselectQuest,
    dragItemStarted,
    dragItemEnded,
    pickAdventurerForQuest,
    unPickAdventurerForQuest,
    clearSelectedParty,
    changeAdventurersInChallenge,
    claimQuestOutcome,
    selectAdventurer,
} = inventoryState.actions

