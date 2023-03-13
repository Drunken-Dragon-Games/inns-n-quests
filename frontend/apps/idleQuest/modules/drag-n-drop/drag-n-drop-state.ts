import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ReactNode } from "react"
import { notEmpty } from "../../common"
import { Dragging, Dropbox } from "./drag-n-drop-dsl"

export type DragNDropState = {
    dragging: boolean
    draggingState?: Dragging
    dropBoxes: Record<string, Record<string, Dropbox>>
    genDraggingItemView: () => ReactNode
}

export type DragNDropStoreState = 
    ReturnType<typeof dragNDropStore.getState> // Includes Thunks Middleware

const dragNDropInitialState: DragNDropState = { 
    dragging: false,
    dropBoxes: {},
    genDraggingItemView: () => null
}

export const dragNDropState = createSlice({
    name: "drag-n-drop-state",
    initialState: dragNDropInitialState,
    reducers: {

        registerDropbox: (state, action: PayloadAction<Dropbox>) => {
            const dropbox = action.payload
            if (!state.dropBoxes[dropbox.data.utility]) state.dropBoxes[dropbox.data.utility] = { [dropbox.data.dropboxId]: dropbox }
            else state.dropBoxes[dropbox.data.utility][dropbox.data.dropboxId] = dropbox
        },

        deregisterDropbox: (state, action: PayloadAction<string>) => {
            const dropBoxId = action.payload
            Object.keys(state.dropBoxes).forEach((utility) => {
                delete state.dropBoxes[utility][dropBoxId]
            })
        },

        deregisterUtility: (state, action: PayloadAction<string>) => {
            const utility = action.payload
            delete state.dropBoxes[utility]
        },

        setHoveringPayload: (state, action: PayloadAction<{ dropboxId: string, payload: any }>) => {
            const { dropboxId, payload } = action.payload
            Object.keys(state.dropBoxes).forEach((utility) => {
                const dropbox = state.dropBoxes[utility][dropboxId]
                if (dropbox) dropbox.data.hoveringPayload = payload
            })
        },

        unsetHoveringPayload: (state, action: PayloadAction<string>) => {
            const dropboxId = action.payload
            Object.keys(state.dropBoxes).forEach((utility) => {
                const dropbox = state.dropBoxes[utility][dropboxId]
                if (dropbox) delete dropbox.data.hoveringPayload
            })
        },

        setDroppedPayload: (state, action: PayloadAction<{ dropboxId: string, payload: any }>) => {
            const { dropboxId, payload } = action.payload
            Object.keys(state.dropBoxes).forEach((utility) => {
                const dropbox = state.dropBoxes[utility][dropboxId]
                if (dropbox) dropbox.data.droppedPayload = payload
            })
        },

        unsetDroppedPayload: (state, action: PayloadAction<string>) => {
            const dropboxId = action.payload
            Object.keys(state.dropBoxes).forEach((utility) => {
                const dropbox = state.dropBoxes[utility][dropboxId]
                if (dropbox) delete dropbox.data.droppedPayload
            })
        },

        setDraggingState: (state, action: PayloadAction<Dragging | undefined>) => {
            state.dragging = notEmpty(action.payload)
            state.draggingState = action.payload
        },

        setDraggingItemViewGenerator: (state, action: PayloadAction<() => ReactNode>) => {
            state.genDraggingItemView = action.payload
        },
    }
})

export const dragNDropStore = configureStore({
    reducer: dragNDropState.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
