import { MouseEventHandler, useCallback, useEffect, useState, MouseEvent as ReactMouseEvent } from "react"
import { notEmpty } from "."

export type DragProps = {
    onDrag?: (position: [number, number], vector: [number, number]) => void
    onDrop?: () => void
}

export type DragEffect = {
    dragging: boolean
    initialPosition?: [number, number]
    currentPosition?: [number, number]
    vector?: [number, number]
    startDrag: MouseEventHandler
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
export const useDrag = ({ onDrag, onDrop }: DragProps): DragEffect => {
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
            setCurrentPosition({ position, vector })
            onDrag && onDrag(position, vector)
        }

        const handleMouseUp = () => {
            onDrop && onDrop()
            setCurrentPosition(undefined)
            setInitialPosition(undefined)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        const unregisterListeners = () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return unregisterListeners
    }, [initialPosition])
    
    return { 
        dragging: notEmpty(initialPosition),
        initialPosition,
        currentPosition: currentPosition?.position,
        vector: currentPosition?.vector,
        startDrag: useCallback((event: ReactMouseEvent) => 
            setInitialPosition([event.clientX, event.clientY]), [])
    }
}
