import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { Adventurer, IdleQuestsInventory, individualXPReward, InventoryRecord, Outcome, setRealAPS, tagRealAPS, TakenQuest } from "../../common"
import { Furniture } from "../../common/furniture"
import { notEmpty } from "../../utils"
import { ActivitySelection, draggingIntersects, DraggingState, DropBox, DropBoxesState, DropBoxUtility, InventoryAsset, sortAdventurers } from "./inventory-dsl"

export interface InventoryState {
    open: boolean
    adventurers: InventoryRecord<Adventurer>
    furniture: InventoryRecord<Furniture>
    takenQuests: TakenQuest[]

    activitySelection?: ActivitySelection
    draggingState?: DraggingState
    dropBoxesState?: DropBoxesState
    selectedParty: (Adventurer | null)[]
}

export type InventoryStoreState = 
    ReturnType<typeof inventoryStore.getState> // Includes Thunks Middleware

export type InventoryThunk<ReturnType = void> = 
    ThunkAction<ReturnType, InventoryStoreState, unknown, Action<string>>

const inventoryInitialState: InventoryState = { 
    open: false,
    adventurers: {},
    furniture: {},
    takenQuests: [],
    selectedParty: [],
}

export const inventoryState = createSlice({
    name: "inventory-state",
    initialState: inventoryInitialState,
    reducers: {

        /** Inventory */
        toggleInventory: (state, action: PayloadAction<boolean | undefined>) => {
            state.open = action.payload ?? !state.open
        },

        setInventory: (state, action: PayloadAction<IdleQuestsInventory>) => {
            state.adventurers = action.payload.adventurers
            state.furniture = action.payload.furniture
        },

        removeFromInventory: (state, action: PayloadAction<string[]>) => {
            const ids = action.payload
            ids.forEach(id => {
                delete state.adventurers[id]
                delete state.furniture[id]
            })
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

        /** Activities State */
        openActivity: (state, action: PayloadAction<ActivitySelection | undefined>) => {
            const activity = action.payload
            state.activitySelection = activity
            if (activity?.ctype === "available-quest")
                state.selectedParty = Array(activity.slots).fill(null)
            else if (activity?.ctype === "taken-quest")
                state.selectedParty = Array(activity.quest.slots).fill(null).map((_, index) => 
                    state.adventurers[activity.adventurerIds[index]] ?? null)
                    //state.adventurers.find(adventurer => adventurer.adventurerId === activity.adventurerIds[index]) ?? null)
            else 
                state.selectedParty = []
        },

        closeActivity: (state) => {
            state.activitySelection = undefined
            state.selectedParty = []
        },

        /** Drag & Drop */
        registerDropBoxes: (state, action: PayloadAction<{utility: DropBoxUtility, dropBoxes: DropBox[]}>) => {
            const { utility, dropBoxes } = action.payload
            if (dropBoxes.length === 0) state.dropBoxesState = undefined
            else state.dropBoxesState = { utility, dragging: notEmpty(state.draggingState), dropBoxes, }
        },

        setDraggingState: (state, action: PayloadAction<DraggingState | undefined>) => {
            const [ newDropBoxesState, newDraggingState ] = draggingIntersects(state.dropBoxesState, action.payload)
            state.draggingState = newDraggingState
            state.dropBoxesState = newDropBoxesState
        },

        dragItemEnded: (state) => {
            if (state.dropBoxesState?.utility === "party-pick")
                state.dropBoxesState.dropBoxes.forEach((dropBox, index) => {
                    if (dropBox.hovering?.ctype === "adventurer") state.selectedParty[index] = dropBox.hovering
                    dropBox.hovering = undefined
                })

            else if (state.dropBoxesState) 
                state.dropBoxesState.dropBoxes.forEach(dropBox => {
                    if (dropBox.hovering) dropBox.dropped = dropBox.hovering
                    dropBox.hovering = undefined
                })

            state.draggingState = undefined
        },

        /** Party Pick */
        addAdventurerToParty: (state, action: PayloadAction<{ adventurer: Adventurer, slot?: number }>) => {
            const adventurer = action.payload.adventurer
            const slotNumber = action.payload.slot

            if (slotNumber) {
                state.selectedParty[slotNumber] = adventurer
            } else {
                const indexNull = state.selectedParty.indexOf(null)
                const indexAdventurer = state.selectedParty
                    .map(a => a ? a.adventurerId : a)
                    .indexOf(adventurer.adventurerId)
                const alreadySelected = indexAdventurer !== -1
                const partyFull = indexNull === -1
                if (alreadySelected)
                    state.selectedParty[indexAdventurer] = null
                else if (partyFull)
                    state.selectedParty[0] = adventurer
                else
                    state.selectedParty[indexNull] = adventurer
            }

        },

        removeAdventurerFromParty: (state, action: PayloadAction<Adventurer>) => {
            state.selectedParty = state.selectedParty.map(adventurer => 
                adventurer?.adventurerId === action.payload.adventurerId ? null : adventurer)
        },

        clearSelectedParty: (state) => {
            if (state.activitySelection && state.activitySelection.ctype === "available-quest")
                state.selectedParty = Array(state.activitySelection.slots).fill(null)
            else 
                state.selectedParty = []
        },
        
        /** Adventurer List State */
        changeAdventurersInChallenge: (state, action: PayloadAction<{ adventurers: Adventurer[], inChallenge: boolean }>) => {
            action.payload.adventurers.forEach(adventurer => {
                state.adventurers[adventurer.adventurerId].inChallenge = action.payload.inChallenge
            })
            /*
            state.adventurers.forEach(adventurer => {
                action.payload.adventurers.forEach((actionAdventurer) => {
                    if(actionAdventurer.adventurerId == adventurer.adventurerId){
                        adventurer.inChallenge = action.payload.inChallenge
                        return 
                    }
                })
            })
            state.adventurers = sortAdventurers(state.adventurers)
            */
        },

        /** Quest State */
        claimQuestOutcome: (state, action: PayloadAction<{ adventurers: Adventurer[], outcome: Outcome, takenQuest: TakenQuest }>) => {
            const outcome = action.payload.outcome
            const adventurers = action.payload.adventurers
            if (state.activitySelection && state.activitySelection.ctype === "taken-quest" && state.activitySelection.takenQuestId === action.payload.takenQuest.takenQuestId)
                state.activitySelection.claimedAt = new Date().toISOString()
            if (outcome.ctype === "success-outcome" && outcome.reward.apsExperience) {
                const individualXP = individualXPReward(adventurers, outcome.reward.apsExperience)
                adventurers.forEach(adventurer => {
                    const newAdventurer = 
                        setRealAPS({
                            ...adventurer,
                            inChallenge: false,
                            athXP: adventurer.athXP + individualXP[adventurer.adventurerId].athleticism,
                            intXP: adventurer.intXP + individualXP[adventurer.adventurerId].intellect,
                            chaXP: adventurer.chaXP + individualXP[adventurer.adventurerId].charisma,
                        })
                    state.adventurers[adventurer.adventurerId] = newAdventurer
                })
            } else if (outcome.ctype === "failure-outcome") {
                adventurers.forEach(adventurer => {
                    state.adventurers[adventurer.adventurerId].inChallenge = false
                })
            }
        },
    },
});

export const {
    /** Inventory */
    toggleInventory,
    setInventory,
    removeFromInventory,
    setTakenQuests,
    addTakenQuest,
    removeTakenQuest,
    /** Activities State */
    openActivity,
    closeActivity,
    /** Drag & Drop */
    registerDropBoxes,
    setDraggingState,
    dragItemEnded,
    /** Party Pick */
    addAdventurerToParty,
    removeAdventurerFromParty,
    clearSelectedParty,
    /** Adventurer List State */
    changeAdventurersInChallenge,
    /** Quest State */
    claimQuestOutcome,
} = inventoryState.actions

export const inventoryStore = configureStore({
    reducer: inventoryState.reducer,
})
