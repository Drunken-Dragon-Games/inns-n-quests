import { ReactNode } from "react"
import { Dragging, Dropbox } from "./drag-n-drop-dsl"
import { dragNDropState, dragNDropStore } from "./drag-n-drop-state"

const actions = dragNDropState.actions

const dispatch = dragNDropStore.dispatch

const DragNDropTransitions = {

    setDraggingState: (state?: Dragging): void => {
        dispatch(actions.setDraggingState(state)) },

    registerDropBox: (dropBox: Dropbox): void => {
        dispatch(actions.registerDropbox(dropBox)) },

    deregisterDropbox: (dropBoxId: string): void => {
        dispatch(actions.deregisterDropbox(dropBoxId)) },

    setHoveringPayload: (dropboxId: string, payload: any): void => {
        dispatch(actions.setHoveringPayload({ dropboxId, payload })) },

    unsetHoveringPayload: (dropboxId: string): void => {
        dispatch(actions.unsetHoveringPayload(dropboxId)) },

    setDroppedPayload: (dropboxId: string, payload: any): void => {
        dispatch(actions.setDroppedPayload({ dropboxId, payload })) },

    unsetDroppedPayload: (dropboxId: string): void => {
        dispatch(actions.unsetDroppedPayload(dropboxId)) },

    setDraggingItemViewGenerator: (gen: () => ReactNode): void => {
        dispatch(actions.setDraggingItemViewGenerator(gen)) },
}

export default DragNDropTransitions
