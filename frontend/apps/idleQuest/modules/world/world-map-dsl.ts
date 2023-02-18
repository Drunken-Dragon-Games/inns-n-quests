import { MouseEventHandler, useEffect, useState } from "react"
import { px1, Units } from "../../utils"

export type WorldMap = {
    name: string
    baseUri: string
    baseSectorWidth: number,
    baseSectorHeight: number,
    size: [number, number]
    units: Units
}

export const nwThiolden: WorldMap = {
    name: "Northwest Thiolden",
    baseUri: "https://cdn.ddu.gg/maps/idle-quests-wm/nw-thiolden_(0,0).gif",
    baseSectorWidth: 819,
    baseSectorHeight: 614,
    size: [3, 3],
    units: px1,
}

export const resizeWorldMap = (wm: WorldMap, scale: number): WorldMap => 
    ({...wm, units: wm.units.scaleBy(scale) })

export const worldMapWidth = (wm: WorldMap): number => wm.size[0] * wm.baseSectorWidth

export const worldMapHeight = (wm: WorldMap): number => wm.size[1] * wm.baseSectorHeight

export const worldMapWidthUnits = (wm: WorldMap): string => wm.units.u(worldMapWidth(wm))

export const worldMapHeightUnits = (wm: WorldMap): string => wm.units.u(worldMapHeight(wm))

export const worldMapUriMatrix = (wm: WorldMap): string[] =>
    Array(wm.size[1]).fill(0).flatMap((_, y) =>
        Array(wm.size[0]).fill(0).map((_, x) => {
            const [xCoord, yCoord] = arrayCoordToWMCoord([x, y], wm.size)
            return wm.baseUri.replace("(0,0)", `(${xCoord},${yCoord})`)
        }))

export const worldMapLocationOffsetUnits = (wm: WorldMap, location: [number, number]): [string, string] => {
    const [x, y] = worldMapLocationOffset(wm, location)
    return [wm.units.u(x), wm.units.u(y)]
}

/**
 * If you create a matrix of the world map, this function will transform the array coords to the map coords
 * Ex. 
 * 
 * (0,0), (0,1), (0,2)
 * (1,0), (1,1), (1,2)
 * (2,0), (2,1), (2,2)
 * 
 * to
 * 
 * (-1, 1), (0, 1), (1, 1)
 * (-1, 0), (0, 0), (1, 0)
 * (-1,-1), (0,-1), (1,-1)
 * 
 * @param x 
 * @param y 
 * @param size 
 * @returns 
 */
export const arrayCoordToWMCoord = (coords: [number, number], size: [number, number]): [number, number] => 
    [ coords[0] - Math.floor(size[0] / 2)
    , Math.floor(size[1] / 2) - coords[1]
    ]

/**
 * Maps the location to the offset required to center the map
 * 
 * @param wm 
 * @param location 
 * @returns 
 */
export const worldMapLocationOffset = (wm: WorldMap, location: [number, number]): [number, number] => 
    [ location[0] - worldMapWidth(wm) / 2 //+ wm.baseSectorWidth / 2
    , location[1] - worldMapHeight(wm) / 2 //+ wm.baseSectorHeight / 2
    ]

/**
 * Handles the dragging of the map. Takes the current location and a callback for the location change 
 * and returns a function that can be used as a mouse event handler to start the drag, should be used on an
 * 'onMouseDown' event handler.
 * 
 * @param currentLocation 
 * @param onLocationDrag 
 * @returns 
 */
export const useDragMapLocation = (currentLocation: [number, number], onLocationDrag: (newLocation: [number, number]) => void): { dragging: boolean, onStartDrag: MouseEventHandler } => {
    const [dragging, setDragging] = useState<[number, number] | undefined>(undefined)
    useEffect(() => {
        if (dragging) {
            let limiter = 0
            const handleMouseMove = (event: MouseEvent) => {
                if (limiter++ % 5 !== 0) return
                const moveX = event.clientX - dragging[0] 
                const moveY = event.clientY - dragging[1] 
                onLocationDrag([ currentLocation[0] + moveX, currentLocation[1] + moveY])
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
