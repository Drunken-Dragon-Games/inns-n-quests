import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { Character, Furniture, IdleQuestsInventory, TakenStakingQuest } from "../../common"
import * as vm from "../../game-vm"
import { ActivitySelection, CharacterParty, InventoryPageName } from "./inventory-dsl"

export interface InventoryState {
    open: boolean
    dragonSilver: number
    characters: Record<string, Character>
    furniture: Record<string, Furniture>
    takenQuests: TakenStakingQuest[]

    activitySelection?: ActivitySelection
    activeInventoryPage: InventoryPageName
    activeCharacterInfo?: Character

    selectedParty: CharacterParty
}

export type InventoryStoreState = 
    ReturnType<typeof inventoryStore.getState> // Includes Thunks Middleware

export type InventoryThunk<ReturnType = void> = 
    ThunkAction<ReturnType, InventoryStoreState, unknown, Action<string>>

const inventoryInitialState: InventoryState = { 
    open: false,
    dragonSilver: 0,
    activeInventoryPage: "characters",
    characters: {},
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
            state.dragonSilver = action.payload.dragonSilver
            state.characters = action.payload.characters
            state.furniture = action.payload.furniture
            state.activeCharacterInfo = Object.values(action.payload.characters)[0]
        },

        removeFromInventory: (state, action: PayloadAction<string[]>) => {
            const ids = action.payload
            ids.forEach(id => {
                delete state.characters[id]
                delete state.furniture[id]
            })
        },

        setTakenQuests: (state, action: PayloadAction<TakenStakingQuest[]>) => {
            state.takenQuests = action.payload
        },

        addTakenQuest: (state, action: PayloadAction<TakenStakingQuest>) => {
            state.takenQuests = [...state.takenQuests, action.payload]
        },

        removeTakenQuest: (state, action: PayloadAction<TakenStakingQuest>) => {
            state.takenQuests = state.takenQuests.filter(quest => quest.takenQuestId !== action.payload.takenQuestId)
        },

        /** Pages */
        setInventoryPage: (state, action: PayloadAction<InventoryPageName>) => {
            state.activeInventoryPage = action.payload
        },

        /** Activities State */
        openActivity: (state, action: PayloadAction<ActivitySelection | undefined>) => {
            const activity = action.payload
            state.activitySelection = activity
            if (activity?.ctype === "available-staking-quest")
                state.selectedParty = Array(5).fill(null)
            else if (activity?.ctype === "taken-staking-quest")
                state.selectedParty = Array(5).fill(null).map((_, index) => {
                    return state.characters[activity.partyIds[index]] ?? null })
                    //state.characters.find(character => character.entityId === activity.adventurerIds[index]) ?? null)
            else 
                state.selectedParty = Array(5).fill(null)
        },

        closeActivity: (state) => {
            state.activitySelection = undefined
            state.selectedParty = []
        },

        /** Character Info State */
        setCharacterInfo: (state, action: PayloadAction<Character | undefined>) => {
            state.activeCharacterInfo = action.payload
        },

        /** Party Pick */
        addCharacterToParty: (state, action: PayloadAction<{ character: Character, slot?: number }>) => {
            const character = action.payload.character
            const slotNumber = action.payload.slot

            // Remove character from party if already selected
            state.selectedParty = state.selectedParty.map(character => 
                character?.entityId === action.payload.character.entityId ? null : character)

            if (slotNumber) {
                state.selectedParty[slotNumber] =character 
            } else {
                const indexNull = state.selectedParty.indexOf(null)
                const indexCharacter = state.selectedParty
                    .map(a => a ? a.entityId : a)
                    .indexOf(character.entityId)
                const alreadySelected = indexCharacter !== -1
                const partyFull = indexNull === -1
                if (alreadySelected)
                    state.selectedParty[indexCharacter] = null
                else if (partyFull)
                    state.selectedParty[0] = character 
                else
                    state.selectedParty[indexNull] =character 
            }

        },

        removeCharacterFromParty: (state, action: PayloadAction<Character>) => {
            state.selectedParty = state.selectedParty.map(character => 
                character?.entityId === action.payload.entityId ? null : character)
        },

        clearSelectedParty: (state) => {
            state.selectedParty = Array(5).fill(null)
        },
        
        /** Character List State */
        changeCharactersInChallenge: (state, action: PayloadAction<{ characters: Character[], inActivity: boolean }>) => {
            action.payload.characters.forEach(character => {
                state.characters[character.entityId].inActivity = action.payload.inActivity
            })
        },

        /** Quest State */
        claimQuestOutcome: (state, action: PayloadAction<{ characters: Character[], outcome: vm.StakingQuestOutcome, takenQuest: TakenStakingQuest }>) => {
            const outcome = action.payload.outcome
            const characters = action.payload.characters
            characters.forEach(character => state.characters[character.entityId].inActivity = false)
            if (state.activitySelection?.ctype === "taken-staking-quest" && state.activitySelection.takenQuestId === action.payload.takenQuest.takenQuestId) {
                state.activitySelection.claimedAt = new Date()
                state.activitySelection.outcome = outcome
            }
            if (outcome.ctype === "success-outcome")
                state.dragonSilver += outcome.reward.currency
        },
    },
});

export const inventoryStore = configureStore({
    reducer: inventoryState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
