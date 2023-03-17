import { Unsubscribe } from "@reduxjs/toolkit"
import { RefObject, useEffect, useRef, useState } from "react"
import { v4 } from "uuid"
import { notEmpty } from "../../common"
import { Dragging, DragInitiators, Dropbox, DropboxData, UseDragParams } from "./drag-n-drop-dsl"
import { dragNDropStore } from "./drag-n-drop-state"
import DragNDropTransitions from "./drag-n-drop-transitions"

const emptyIntersectingState = { intersecting: [] as Dropbox[], notIntersecting: [] as Dropbox[] }

const DragNDropApi = {

    subscribe: (utility: string, callback: (state: DropboxData[], dragging?: Dragging) => void): Unsubscribe => {
        const unsubscribe = dragNDropStore.subscribe(() => {
            const state = dragNDropStore.getState()
            const dropboxes = state.dropBoxes[utility]
            if (!dropboxes) return
            const dropboxData = Object.values(dropboxes).map(dropbox => dropbox.data)
            callback(dropboxData, state.draggingState)
        })
        return unsubscribe
    },

    useDropbox(dropboxProps: { 
        utility: string, 
        onHoveringEnter?: (dropbox: DropboxData, position: [number, number]) => void, 
        onHoveringLeave?: (dropbox: DropboxData, position: [number, number]) => void,
        onHoveringMove?: (dropbox: DropboxData, position: [number, number]) => void,
        onDropped?: (dropbox: DropboxData, position: [number, number]) => void,
    }): { 
        ref: RefObject<HTMLDivElement>, 
        clearDropbox: () => void 
    } {
        const ref = useRef<HTMLDivElement>(null)
        const dropboxIdRef = useRef<string>()
        useEffect(() => {
            if (!ref.current) return
            const { top, left, bottom, right } = ref.current.getBoundingClientRect()
            const dropboxId = v4()
            dropboxIdRef.current = dropboxId
            DragNDropTransitions.registerDropBox({
                data: { dropboxId, utility: dropboxProps.utility, top, left, bottom, right },
                onHoveringEnter: dropboxProps.onHoveringEnter,
                onHoveringLeave: dropboxProps.onHoveringLeave,
                onHoveringMove: dropboxProps.onHoveringMove,
                onDropped: dropboxProps.onDropped,
            })
            return () => DragNDropTransitions.deregisterDropbox(dropboxId)
        }, [ref.current])
        return { ref, clearDropbox: () => DragNDropTransitions.unsetDroppedPayload(dropboxIdRef.current!) }
    },

    dragging: () =>
        dragNDropStore.getState().dragging,

    /**
     * Handles the dragging of any element by keeping track of a location pair. 
     * Returns a function that can be used as a mouse event handler or touch event handler to start the drag.
     * Should be used on an * 'onMouseDown' event handler or ''.

     * @returns 
     */
    useDrag({ 
        utility, 
        payload, 
        draggingView, 
        onDragStart, 
        onDragStop, 
        enabled = true, 
        effectiveDraggingVectorMagnitude = 1, 
        effectiveDraggingVectorMin, 
        effectiveDraggingVectorMax 
    }: UseDragParams): DragInitiators & { dragging: boolean } {
        const [initialPosition, setInitialPosition] = useState<[number, number] | undefined>(undefined)
        const currentPosition = useRef<[number, number] | undefined>(undefined)
        const savedPayload = useRef<any>(undefined)
        const effectiveDraggingStarted = useRef(false)
        const dragging = notEmpty(initialPosition)

        const draggingVector = (): [number, number] => [
            (currentPosition.current ?? [0,0])[0] - (initialPosition ?? [0,0])[0], 
            (currentPosition.current ?? [0,0])[1] - (initialPosition ?? [0,0])[1]
        ]

        const draggingMagnitude = (): number => {
            const vector = draggingVector()
            return Math.sqrt(vector[0] ** 2 + vector[1] ** 2)
        }

        const angleBetweenVectors = (vector1: [number, number], vector2: [number, number]): number => {
            const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1]
            const magnitude1 = Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2)
            const magnitude2 = Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2)
            return Math.acos(dotProduct / (magnitude1 * magnitude2))
        }

        const isDraggingVectorBetweenMinAndMax = (): boolean => {
            if (!effectiveDraggingVectorMin || !effectiveDraggingVectorMax) return true
            const angleBetweenDraggingAndMin = angleBetweenVectors(draggingVector(), effectiveDraggingVectorMin)
            const angleBetweenDraggingAndMax = angleBetweenVectors(draggingVector(), effectiveDraggingVectorMax)
            const angleBetweenMinAndMax = angleBetweenVectors(effectiveDraggingVectorMin, effectiveDraggingVectorMax)
            return angleBetweenDraggingAndMin < angleBetweenMinAndMax && angleBetweenDraggingAndMax < angleBetweenMinAndMax
        }

        const isDraggingEffective = (): boolean => 
            draggingMagnitude() >= effectiveDraggingVectorMagnitude && isDraggingVectorBetweenMinAndMax()

        const initDragging = (position: [number, number]) => {
            if (!enabled) return
            savedPayload.current = payload
            currentPosition.current = position
            effectiveDraggingStarted.current = false
            DragNDropTransitions.setDraggingState()
            DragNDropTransitions.setDraggingItemViewGenerator(draggingView)
            setInitialPosition(position)
        }
        
        const resetState = () => {
            savedPayload.current = undefined
            currentPosition.current = undefined
            effectiveDraggingStarted.current = false
            DragNDropTransitions.setDraggingState()
            DragNDropTransitions.setDraggingItemViewGenerator(() => null)
            setInitialPosition(undefined)
        }

        useEffect(() => {
            if (!dragging) return

            const intersectingDropboxes = (position: [number, number]): { intersecting: Dropbox[], notIntersecting: Dropbox[] } => {
                const registry = dragNDropStore.getState().dropBoxes
                if (!registry[utility]) return emptyIntersectingState
                const dropboxes = Object.values(registry[utility])
                return dropboxes.reduce(({ intersecting, notIntersecting }, dropbox) => {
                    if (dropbox.data.top < position[1] &&
                        dropbox.data.bottom > position[1] &&
                        dropbox.data.left < position[0] &&
                        dropbox.data.right > position[0])
                        return { intersecting: [...intersecting, dropbox], notIntersecting }
                    else
                        return { intersecting, notIntersecting: [...notIntersecting, dropbox] }
                }, emptyIntersectingState)
            }

            const notifyHovering = () => {
                const position = currentPosition.current ?? [0,0]
                const { intersecting, notIntersecting } = intersectingDropboxes(position)
                DragNDropTransitions.setDraggingState({ utility, hovering: intersecting.length !== 0, position })
                intersecting.forEach(dropbox => {
                    if (!dropbox.data.hoveringPayload) {
                        dropbox.onHoveringEnter && dropbox.onHoveringEnter({...dropbox.data, hoveringPayload: savedPayload.current}, currentPosition.current!)
                        DragNDropTransitions.setHoveringPayload(dropbox.data.dropboxId, savedPayload.current)
                    } 
                    dropbox.onHoveringMove && dropbox.onHoveringMove({...dropbox.data, hoveringPayload: savedPayload.current}, currentPosition.current!)
                })
                notIntersecting.forEach(dropbox => {
                    if (dropbox.data.hoveringPayload) {
                        dropbox.onHoveringLeave && dropbox.onHoveringLeave({...dropbox.data, hoveringPayload: undefined}, currentPosition.current!)
                        DragNDropTransitions.unsetHoveringPayload(dropbox.data.dropboxId)
                    }
                })
            }

            const notifyDrop = () => {
                const { intersecting } = intersectingDropboxes(currentPosition.current ?? [0,0])
                intersecting.forEach(dropbox => {
                    DragNDropTransitions.setDroppedPayload(dropbox.data.dropboxId, savedPayload.current)
                    DragNDropTransitions.unsetHoveringPayload(dropbox.data.dropboxId)
                    dropbox.onDropped && dropbox.onDropped({...dropbox.data, hoveringPayload: undefined, droppedPayload: savedPayload.current}, currentPosition.current!)
                })
            }

            const handleMove = (clientX: number, clientY: number) => {
                currentPosition.current = [clientX, clientY]
                if (effectiveDraggingStarted.current) notifyHovering()
                else if (isDraggingEffective()) {
                    effectiveDraggingStarted.current = true
                    onDragStart && onDragStart()
                    notifyHovering()
                }
            }

            const handleMouseMove = (event: MouseEvent) => {
                handleMove(event.clientX, event.clientY)
            }

            const handleTouchMove = (event: TouchEvent) => {
                if (effectiveDraggingStarted.current) event.preventDefault()
                handleMove(event.touches[0].clientX, event.touches[0].clientY)
            }

            const handleStop = () => {
                if (effectiveDraggingStarted.current) notifyDrop()
                onDragStop && onDragStop()
                resetState()
            }

            const handleMouseUp = () => {
                handleStop()
                unregisterListeners()
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }

            const handleTouchEnd = () => {
                handleStop()
                unregisterListeners()
                window.removeEventListener('touchmove', handleTouchMove)
                window.removeEventListener('touchend', handleTouchEnd)
            }

            const unregisterListeners = () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
                window.removeEventListener('touchmove', handleTouchMove)
                window.removeEventListener('touchend', handleTouchEnd)
            }

            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove, { passive: false })
            window.addEventListener('touchend', handleTouchEnd)

            return unregisterListeners
        }, [initialPosition])

        return { 
            dragging,
            startDrag: (event: React.MouseEvent) => initDragging([event.clientX, event.clientY]),
            startDragTouch: (event: React.TouchEvent) => initDragging([event.touches[0].clientX, event.touches[0].clientY]),
        }
    }
}

export default DragNDropApi
