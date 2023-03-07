import { Action, configureStore, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { Character, Furniture, IdleQuestsInventory, TakenStakingQuest } from "../../common"
import { notEmpty } from "../../utils"
import { ActivitySelection, draggingIntersects, DraggingState, DropBox, DropBoxesState, DropBoxUtility, InventoryAsset, sortCharacters } from "./inventory-dsl"
import * as vm from "../../game-vm"

export interface InventoryState {
    open: boolean
    characters: Record<string, Character>
    furniture: Record<string, Furniture>
    takenQuests: TakenStakingQuest[]

    activitySelection?: ActivitySelection
    activeCharacterInfo?: Character

    draggingState?: DraggingState
    dropBoxesState?: DropBoxesState
    selectedParty: (Character | null)[]
}

export type InventoryStoreState = 
    ReturnType<typeof inventoryStore.getState> // Includes Thunks Middleware

export type InventoryThunk<ReturnType = void> = 
    ThunkAction<ReturnType, InventoryStoreState, unknown, Action<string>>

const inventoryInitialState: InventoryState = { 
    open: false,
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

        /** Activities State */
        openActivity: (state, action: PayloadAction<ActivitySelection | undefined>) => {
            const activity = action.payload
            state.activitySelection = activity
            if (activity?.ctype === "available-staking-quest")
                state.selectedParty = Array(activity.slots).fill(null)
            else if (activity?.ctype === "taken-staking-quest")
                state.selectedParty = Array(activity.availableQuest.slots).fill(null).map((_, index) => 
                    state.characters[activity.adventurerIds[index]] ?? null)
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
                    if (dropBox.hovering?.ctype === "character") state.selectedParty[index] = dropBox.hovering
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
        addCharacterToParty: (state, action: PayloadAction<{ character: Character, slot?: number }>) => {
            const character = action.payload.character
            const slotNumber = action.payload.slot

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
            /*
            state.characters.forEach(character => {
                action.payload.characters.forEach((actionCharacter) => {
                    if(actionCharacter.entityId == character.entityId){
                        character.inActivity = action.payload.inActivity
                        return 
                    }
                })
            })
            state.characters = sortCharacters(state.characters)
            */
        },

        /** Quest State */
        claimQuestOutcome: (state, action: PayloadAction<{ characters: Character[], outcome: vm.StakingQuestOutcome, takenQuest: TakenStakingQuest }>) => {
            const outcome = action.payload.outcome
            const characters = action.payload.characters
            characters.forEach(character => state.characters[character.entityId].inActivity = false)
            if (state.activitySelection?.ctype === "taken-staking-quest" && state.activitySelection.takenQuestId === action.payload.takenQuest.takenQuestId)
                state.activitySelection.claimedAt = new Date()
            /*
            if (outcome.ctype === "success-outcome" && outcome.reward.apsExperience) {
                const individualXP = individualXPReward(characters, outcome.reward.apsExperience)
                characters.forEach(character => {
                    const newCharacter = 
                        setRealAPS({
                            ...character,
                            inActivity: false,
                            athXP: character.athXP + individualXP[character.entityId].athleticism,
                            intXP: character.intXP + individualXP[character.entityId].intellect,
                            chaXP: character.chaXP + individualXP[character.entityId].charisma,
                        })
                    state.characters[character.entityId] = neCharacterw
                })
            } else if (outcome.ctype === "failure-outcome") {
                characters.forEach(character => {
                    state.characters[character.entityId].inActivity = false
                })
            }
            */
        },
    },
});

export const inventoryStore = configureStore({
    reducer: inventoryState.reducer,
})
