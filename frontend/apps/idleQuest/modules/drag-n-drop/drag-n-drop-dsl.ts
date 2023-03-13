import { MouseEventHandler, ReactNode, TouchEventHandler } from "react"

export type UseDragParams = { 
    utility: string, 
    payload: any, 
    enabled?: boolean, 
    effectiveDraggingVectorMagnitude?: number, 
    draggingView: () => ReactNode, 
    onDragStart?: () => void 
    onDragStop?: () => void
}

export type DragInitiators = {
    startDrag: MouseEventHandler
    startDragTouch: TouchEventHandler
}

export type Dragging = {
    utility: string
    hovering: boolean
    position: [number, number]
}

export type DropboxData = {
    dropboxId: string
    utility: string
    top: number
    bottom: number
    left: number
    right: number
    hoveringPayload?: any
    droppedPayload?: any
}

export type Dropbox = {
    data: DropboxData
    onHoveringEnter?: (dropbox: DropboxData, position: [number, number]) => void
    onHoveringLeave?: (dropbox: DropboxData, position: [number, number]) => void
    onHoveringMove?: (dropbox: DropboxData, position: [number, number]) => void
    onDropped?: (dropbox: DropboxData, position: [number, number]) => void
}
