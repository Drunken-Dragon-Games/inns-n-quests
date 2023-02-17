import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Adventurer, TakenQuest, AvailableQuest, SelectedQuest, Outcome, individualXPReward, tagRealAPS } from "../dsl"

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

export interface QuestBoardState {
    initLoading: boolean

    inventoryOpen: boolean
    adventurers: Adventurer[]
    takenQuests: TakenQuest[]

    availableQuests: AvailableQuest[]
    selectedQuest?: SelectedQuest
    selectedAdventurer?: Adventurer
    adventurerSlots: (Adventurer | null)[]
}

const questBoardInitialState: QuestBoardState = { 
    initLoading: true,

    inventoryOpen: false,
    adventurers: [],
    takenQuests: [],

    availableQuests: [],
    adventurerSlots: [],
}

export const questBoardState = createSlice({
    name: "quest-board-state",
    initialState: questBoardInitialState,
    reducers: {

        setInitLoading: (state, action: PayloadAction<boolean>) => {
            state.initLoading = action.payload
        },

        toggleInventory: (state) => {
            state.inventoryOpen = !state.inventoryOpen
        },

        setInventory: (state, action: PayloadAction<Adventurer[]>) => {
            state.adventurers = sortAdventurers(action.payload)
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

        addAvailableQuests: (state, action: PayloadAction<AvailableQuest[]>) => {
            state.availableQuests = [...state.availableQuests, ...action.payload]
        },

        removeAvailableQuest: (state, action: PayloadAction<AvailableQuest>) => {
            state.availableQuests = state.availableQuests.filter(quest => quest.questId !== action.payload.questId)
        },

        clearAvailableQuests: (state) => {
            state.availableQuests = []
        },

        selectQuest: (state, action: PayloadAction<SelectedQuest>) => {
            const quest = action.payload
            state.selectedQuest = quest
            if (quest.ctype === "available-quest")
                state.adventurerSlots = Array(quest.slots).fill(null)
            else
                state.adventurerSlots = Array(quest.quest.slots).fill(null).map((_, index) => 
                    state.adventurers.find(adventurer => adventurer.adventurerId === quest.adventurerIds[index]) ?? null)
        },

        unselectQuest: (state) => {
            state.selectedQuest = undefined
            state.adventurerSlots = []
        },

        pickAdventurerForQuest: (state, action: PayloadAction<Adventurer>) => {
            if (!state.selectedQuest) return
            const indexNull = state.adventurerSlots.indexOf(null)
            const indexAdventurer = state.adventurerSlots
                .map(a => a ? a.adventurerId : a)
                .indexOf(action.payload.adventurerId)
            const alreadySelected = indexAdventurer !== -1
            const partyFull = indexNull === -1
            if (alreadySelected)
                state.adventurerSlots[indexAdventurer] = null
            else if (partyFull) 
                state.adventurerSlots[0] = action.payload
            else 
                state.adventurerSlots[indexNull] = action.payload
        },

        unPickAdventurerForQuest: (state, action: PayloadAction<Adventurer>) => {
            state.adventurerSlots = state.adventurerSlots.map(adventurer => 
                adventurer?.adventurerId === action.payload.adventurerId ? null : adventurer)
        },

        clearSelectedAdventurers: (state) => {
            if (state.selectedQuest && state.selectedQuest.ctype === "available-quest")
                state.adventurerSlots = Array(state.selectedQuest.slots).fill(null)
            else 
                state.adventurerSlots = []
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
            if (state.selectedQuest && state.selectedQuest.ctype === "taken-quest" && state.selectedQuest.takenQuestId === action.payload.takenQuest.takenQuestId)
                state.selectedQuest.claimedAt = new Date().toISOString()
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
                state.adventurerSlots = state.adventurerSlots.map(adventurer => {
                    if (!adventurer) return adventurer
                    return state.adventurers.find(a => a.adventurerId === adventurer.adventurerId)!
                })
            }
        },

        selectAdventurer: (state, action: PayloadAction<Adventurer | undefined>) => {
            state.selectedAdventurer = action.payload
        },
    },
});

export const {
    setInitLoading,
    toggleInventory,
    setInventory,
    setTakenQuests,
    addTakenQuest,
    removeTakenQuest,
    addAvailableQuests,
    removeAvailableQuest,
    clearAvailableQuests,
    selectQuest,
    unselectQuest,
    pickAdventurerForQuest,
    unPickAdventurerForQuest,
    clearSelectedAdventurers,
    changeAdventurersInChallenge,
    claimQuestOutcome,
    selectAdventurer,
} = questBoardState.actions

