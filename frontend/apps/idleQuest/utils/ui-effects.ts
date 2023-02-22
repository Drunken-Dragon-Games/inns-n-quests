import { MouseEventHandler, useEffect, useState } from "react"

/**
 * Handles the dragging of any element by keeping track of a location pair. 
 * Takes a callback for the location change and returns a function that 
 * can be used as a mouse event handler to start the drag, should be used on an * 'onMouseDown' event handler.
 * 
 * @param currentLocation 
 * @param onDrag 
 * @returns 
 */
export const useDrag = (currentLocation: [number, number], scale: number, onDrag: (newLocation: [number, number]) => void): { dragging: boolean, onStartDrag: MouseEventHandler } => {
    const [dragging, setDragging] = useState<[number, number] | undefined>(undefined)
    useEffect(() => {
        if (dragging) {
            let limiter = 0
            const handleMouseMove = (event: MouseEvent) => {
                if (limiter++ % 5 !== 0) return
                const moveX = event.clientX - dragging[0] 
                const moveY = event.clientY - dragging[1] 
                onDrag([ currentLocation[0] + moveX / scale, currentLocation[1] + moveY / scale])
            }
            const handleMouseUp = () => {
                setDragging(undefined)
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [dragging])
    return { dragging: dragging !== undefined, onStartDrag: (event) => setDragging([event.clientX, event.clientY]) }
}