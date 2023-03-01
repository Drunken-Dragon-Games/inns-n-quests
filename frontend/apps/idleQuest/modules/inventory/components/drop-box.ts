import { RefObject, useMemo, useRef } from "react"
import { notEmpty } from "../../../utils"
import { DraggableItem } from "../inventory-dsl"
import { useSelector } from "../inventory-state"

export type DropBoxState = {
    dragging: boolean
    intersects: boolean
    item?: DraggableItem
}

type BoxRef = RefObject<HTMLDivElement>

// <Item, DraggingEvent<Item>>(): DropBoxState<Item>
function useDropBox<Accepts extends DraggableItem["ctype"]>(accepts: Accepts[], onDrop: (item: DraggableItem) => void): [BoxRef, DropBoxState] {
    const dropAreaRef = useRef<HTMLDivElement>(null)
    const draggingRef = useRef<{ item: DraggableItem, intersects: boolean} | null>(null)
    const draggingState = useSelector(state => state.draggingState)
    useMemo(() => {
        if (draggingRef.current && !draggingState) {
            if (draggingRef.current.intersects) 
                onDrop(draggingRef.current.item)
            draggingRef.current = null
        } else if (dropAreaRef.current && draggingState && (accepts as string[]).includes(draggingState.item.ctype)) {
            const rect = dropAreaRef.current.getBoundingClientRect()
            const intersects = (
                rect.top < draggingState.position[1] && 
                rect.bottom > draggingState.position[1] &&
                rect.left < draggingState.position[0] &&
                rect.right > draggingState.position[0]
            )
            draggingRef.current = { item: draggingState.item, intersects }
        }
    }, [draggingState])
    return [dropAreaRef, {
        dragging: notEmpty(draggingState),
        intersects: draggingRef.current?.intersects ?? false,
        item: draggingRef.current?.item ?? undefined
    }]
}

export type DropBoxState5 = {
    dragging: boolean
    intersects?: 0 | 1 | 2 | 3 | 4
    item?: DraggableItem
}

type DropBoxRefs5 = [BoxRef, BoxRef, BoxRef, BoxRef, BoxRef]

function useDropBoxes5<Accepts extends DraggableItem["ctype"]>(accepts: Accepts[], onDrop: (item: DraggableItem) => void): [DropBoxRefs5, DropBoxState] {
    const dropAreaRefs: DropBoxRefs5 = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ]
    const draggingRef = useRef<{ item: DraggableItem, intersects: boolean} | null>(null)
    const draggingState = useSelector(state => state.draggingState)
    useMemo(() => {
        if (draggingRef.current && !draggingState) {
            if (draggingRef.current.intersects) 
                onDrop(draggingRef.current.item)
            draggingRef.current = null
        } else if (dropAreaRef.current && draggingState && (accepts as string[]).includes(draggingState.item.ctype)) {
            const rect = dropAreaRef.current.getBoundingClientRect()
            const intersects = (
                rect.top < draggingState.position[1] && 
                rect.bottom > draggingState.position[1] &&
                rect.left < draggingState.position[0] &&
                rect.right > draggingState.position[0]
            )
            draggingRef.current = { item: draggingState.item, intersects }
        }
    }, [draggingState])
    return [dropAreaRefs, {
        dragging: draggingState !== null,
        intersects: draggingRef.current?.intersects ?? false,
        item: draggingRef.current?.item ?? null
    }]
}

export default useDropBox
