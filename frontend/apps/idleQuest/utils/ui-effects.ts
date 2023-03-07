import { MouseEventHandler, TouchEventHandler, useCallback, useEffect, useState } from "react"
import { notEmpty } from "."

export type DragProps = {
    onDrag?: (position: [number, number], vector: [number, number]) => void
    onDrop?: () => void
    effectiveDraggingVectorMagnitude?: number
}

export type DragEffect = {
    dragging: boolean
    initialPosition?: [number, number]
    currentPosition?: [number, number]
    vector?: [number, number]
    startDrag: MouseEventHandler
    startDragTouch: TouchEventHandler
}

/**
 * Handles the dragging of any element by keeping track of a location pair. 
 * Takes a callback for the location change and returns a function that 
 * can be used as a mouse event handler to start the drag, should be used on an * 'onMouseDown' event handler.
 * 
 * @param currentLocation 
 * @param onDrag 
 * @returns 
 */
export const useDrag = ({ onDrag, onDrop, effectiveDraggingVectorMagnitude = 1 }: DragProps): DragEffect => {
    const [initialPosition, setInitialPosition] = useState<[number, number] | undefined>(undefined)
    const [currentPosition, setCurrentPosition] = useState<{ position: [number, number], vector: [number, number] } | undefined>(undefined)

    useEffect(() => {
        if (initialPosition === undefined) return
        setCurrentPosition({ position: initialPosition, vector: [0, 0] })
        let limiter = 0

        const handleMouseMove = (event: MouseEvent) => {
            if (limiter++ % 5 !== 0) return
            const position: [number, number] = [event.clientX, event.clientY]
            const vector: [number, number] = [position[0] - initialPosition[0], position[1] - initialPosition[1]]
            const magnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2)
            setCurrentPosition({ position, vector })
            if (magnitude < effectiveDraggingVectorMagnitude) return
            onDrag && onDrag(position, vector)
        }

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault()
            if (limiter++ % 2 !== 0) return
            const position: [number, number] = [event.touches[0].clientX, event.touches[0].clientY]
            const vector: [number, number] = [position[0] - initialPosition[0], position[1] - initialPosition[1]]
            const magnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2)
            setCurrentPosition({ position, vector })
            if (magnitude < effectiveDraggingVectorMagnitude) return
            onDrag && onDrag(position, vector)
        }

        const handleMouseUp = () => {
            onDrop && onDrop()
            setCurrentPosition(undefined)
            setInitialPosition(undefined)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        const handleTouchEnd = () => {
            onDrop && onDrop()
            setCurrentPosition(undefined)
            setInitialPosition(undefined)
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
        dragging: notEmpty(initialPosition),
        initialPosition,
        currentPosition: currentPosition?.position,
        vector: currentPosition?.vector,
        startDrag: useCallback((event: React.MouseEvent) => 
            setInitialPosition([event.clientX, event.clientY]), []),
        startDragTouch: useCallback((event: React.TouchEvent) =>
            setInitialPosition([event.touches[0].clientX, event.touches[0].clientY]), [])
    }
}
